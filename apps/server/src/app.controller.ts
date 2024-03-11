import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { TicketStorageService } from './ticketStorage/ticketStorage.service';
import { APIIdTable } from './model/APIIdTable';
import { APITicket } from './model/APITicket';
import { APIOkWithMeta, APIRespParams } from './model/api.lib';
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

const MAX_CACHE_TTL = 60 * 60 * 1000; // 1 hour
const CACHE = {
  ttlByBestBefore: (bestBefore: number) =>
    Math.min(bestBefore - Date.now(), MAX_CACHE_TTL),
};

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly db: TicketStorageService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  @ApiExtraModels(APITicket, APIIdTable)
  @ApiOkResponse({
    type: APIOkWithMeta.swagger(APIIdTable.swagger(APITicket)),
  })
  async getAllTickets() {
    return this.respondWithCache('all-tickets', async () => {
      const allTickets = await this.db.readAllValid();
      const data = APIIdTable.createByArray(
        allTickets.map(APITicket.create),
        APIIdTable.getId,
      );

      if (allTickets.length === 0) {
        this.logger.verbose('No tickets found.');
        return {
          data,
          bestBefore: 0,
        };
      }

      // We also make scheduler to reset the cache.
      // TTL here is a safety net: in case scheduler becoming a separate subsystem or implementation changes
      const minBestBefore = allTickets
        .map(t => t.bestBefore.getTime())
        .reduce((a, b) => (a < b ? a : b), Infinity);
      this.logger.verbose(
        [
          `Read all ${allTickets.length} tickets.`,
          'Min bestBefore:',
          new Date(minBestBefore).toISOString(),
        ].join(' '),
      );
      return {
        data,
        bestBefore: minBestBefore,
      };
    });
  }

  @Get('ticket/:id')
  @ApiExtraModels(APITicket)
  @ApiNotFoundResponse({
    description: 'Ticket not found if the id is not in the database.',
  })
  @ApiOkResponse({
    type: APIOkWithMeta.swagger(APITicket),
  })
  async getTicketById(@Param('id') id: string) {
    return this.respondWithCache(`ticket/${id}`, async () => {
      const ticket = await this.db.readOne(id);
      if (ticket === null) {
        throw new NotFoundException(`A ticket with id "${id}" is not found`);
      }
      this.logger.verbose(`Read ticket ${id}.`);
      return {
        data: ticket,
        bestBefore: ticket.bestBefore.getTime(),
      };
    });
  }

  private async respondWithCache<T>(
    key: string,
    fn: () => Promise<{ data: T; bestBefore: number }>,
  ): Promise<APIOkWithMeta<APIRespParams<T>>> {
    const perfStart = performance.now();
    const respond = (data: T, msg: string) => {
      this.logger.verbose(
        `[${key}] ${msg}. Response time: ${(performance.now() - perfStart).toFixed(3)} ms.`,
      );
      return APIOkWithMeta.create({ data, perfStart });
    };

    // Check cache
    const cached = await this.cacheManager.get<T | undefined>(key);
    if (cached) {
      return respond(cached, 'Read from cache');
    }

    // Do the work
    const { data, bestBefore } = await fn();
    const ttl = CACHE.ttlByBestBefore(bestBefore);
    if (ttl > 0) {
      this.cacheManager.set(key, data, ttl);
    }
    return respond(
      data,
      ttl > 0
        ? `Setting cache for ${ttl} ms, until: ${new Date(bestBefore).toISOString()}`
        : 'No cache set',
    );
  }
}
