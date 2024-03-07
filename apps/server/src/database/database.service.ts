import { Injectable, Logger } from '@nestjs/common';
import { Ticket } from '../flight/flight.type';
import { getId, createIdTableByArray, writeToIdTable } from '../lib/IdTable';

@Injectable()
export class DatabaseService {
  private tickets = createIdTableByArray([] as Ticket[], getId);
  // private flights = createIdTableByArray([] as TicketFlight[], getId);

  private readonly logger: Logger;

  constructor() {
    const id = (Date.now() + Math.random()).toString(36);
    this.logger = new Logger([DatabaseService.name, id].join(': '));
  }

  async writeManyFlights(flights: Ticket[]) {
    this.logger.debug(`Saving flights ${flights.length}`);
    await Promise.all(flights.map(f => writeToIdTable(this.tickets, getId, f)));
    this.logger.log(`Saved! ${this.tickets.ids.length}`);
  }

  async readAllValidFlights() {
    const now = Date.now();
    const valid = this.tickets.ids
      .map(id => this.tickets.byId[id])
      .filter(f => new Date(f.validUntil).getTime() > now);
    this.logger.verbose(
      `Read flights: total: ${this.tickets.ids.length}, valid: ${valid.length}, now: ${new Date(now).toISOString()}`,
    );
    return valid;
  }
}
