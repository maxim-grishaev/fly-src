import { Injectable, Logger } from '@nestjs/common';
import { APITicket } from '../model/APITicket';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketStorageService {
  private readonly logger = new Logger(
    [
      TicketStorageService.name,
      // Just to make sure there is the same instance of storage service for all the services
      (Date.now() + Math.random()).toString(36),
    ].join(': '),
  );

  constructor(private readonly db: PrismaService) {}

  async writeMany(tickets: APITicket[]) {
    this.logger.debug(`Saving ${tickets.length} flights...`);

    await this.db
      .$transaction(
        tickets.flatMap(t => {
          const ticket4db = t.toCreateInput();
          return [
            ...t.flights
              .map(f => f.toCreateInput())
              .map(flight4db =>
                this.db.ticketFlight.upsert({
                  where: { id: flight4db.id },
                  update: flight4db,
                  create: flight4db,
                }),
              ),
            this.db.ticket.upsert({
              where: { id: t.id },
              update: ticket4db,
              create: ticket4db,
            }),
          ];
        }),
      )
      .catch(e => {
        this.logger.error('Error saving flights', e);
      });

    this.logger.log(`Saved! ${tickets.length} items`);
  }

  async readAllValid() {
    const now = Date.now();
    const dbTickets = await this.db.ticket.findMany({
      where: { bestBefore: { gt: new Date(now) } },
      include: { flights: true },
    });
    const valid = dbTickets.map(t => APITicket.fromPrisma(t, t.flights));
    // .filter(t => t.bestBefore.getTime() > now); // handled by the db query

    this.logger.verbose(`Read ${valid.length} flights`);
    return valid;
  }

  async readOne(id: string) {
    const dbTicket = await this.db.ticket.findUnique({
      where: { id },
      include: { flights: true },
    });

    return !dbTicket ? null : APITicket.fromPrisma(dbTicket, dbTicket.flights);
  }
}
