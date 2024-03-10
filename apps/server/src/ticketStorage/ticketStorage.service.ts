import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { APITicket } from '../model/APITicket';

@Injectable()
export class TicketStorageService extends PrismaClient implements OnModuleInit {
  private readonly logger: Logger;

  onModuleInit() {
    return this.$connect();
  }

  constructor() {
    super();
    const id = (Date.now() + Math.random()).toString(36);
    this.logger = new Logger([TicketStorageService.name, id].join(': '));
  }

  async writeMany(tickets: APITicket[]) {
    this.logger.debug(`Saving ${tickets.length} flights...`);

    await this.$transaction(
      tickets.flatMap(t => {
        const tcri = t.toCreateInput();
        return [
          ...t.flights.map(f => {
            const fcri = f.toCreateInput();
            return this.ticketFlight.upsert({
              where: { id: f.id },
              update: fcri,
              create: fcri,
            });
          }),
          this.ticket.upsert({
            where: { id: t.id },
            update: tcri,
            create: tcri,
          }),
        ];
      }),
    ).catch(e => {
      this.logger.error('Error saving flights', e);
    });

    this.logger.log(`Saved! ${tickets.length} items`);
  }

  async readAllValid() {
    const now = Date.now();
    const dbTickets = await this.ticket.findMany({
      where: { staleAfter: { gt: new Date(now) } },
      include: { flights: true },
    });
    const valid = dbTickets.map(t => APITicket.fromPrisma(t, t.flights));

    this.logger.verbose(`Read ${valid.length} flights`);
    return valid;
  }

  async readOne(id: string) {
    const dbTicket = await this.ticket.findUnique({
      where: { id },
      include: { flights: true },
    });

    return !dbTicket ? null : APITicket.fromPrisma(dbTicket, dbTicket.flights);
  }
}
