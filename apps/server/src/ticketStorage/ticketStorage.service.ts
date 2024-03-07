import { Injectable, Logger } from '@nestjs/common';
import { Ticket } from '../flight/flight.type';
import { getId, createIdTableByArray, writeToIdTable } from '../lib/IdTable';

// interface Link {
//   ticketId: string;
//   flightId: string;
// }

@Injectable()
export class TicketStorageService {
  private tickets = createIdTableByArray([] as Ticket<string>[], getId);
  // private flights = createIdTableByArray([] as TicketFlight[], getId);
  // private links = createIdTableByArray([] as Link[], l =>
  //   [l.ticketId, l.flightId].join('->'),
  // );

  private readonly logger: Logger;

  constructor() {
    const id = (Date.now() + Math.random()).toString(36);
    this.logger = new Logger([TicketStorageService.name, id].join(': '));
  }

  async writeManyFlights(tickets: Ticket[]) {
    this.logger.debug(`Saving flights ${tickets.length}`);

    // const allFlights = tickets.flatMap(t => t.flights);
    // allFlights.forEach(flt => writeToIdTable(this.flights, flt));
    // const links = tickets.flatMap(t =>
    //   t.flights.map(f => ({ ticketId: t.id, flightId: f.id })),
    // );
    // links.forEach(lnk => writeToIdTable(this.links, lnk));

    await Promise.all(tickets.map(tkt => writeToIdTable(this.tickets, tkt)));
    this.logger.log(`Saved! ${this.tickets.ids.length}`);
  }

  async readAllValidFlights() {
    const now = Date.now();
    const valid = this.tickets.ids
      .map(id => this.tickets.byId[id])
      .filter(f => new Date(f.validUntil).getTime() > now);

    // valid.forEach(t => {
    //   t.flights = selectFromIdTable(this.links, l => l.ticketId === t.id)
    //     .map(l => l.flightId)
    //     .map(id => this.flights.byId[id]);
    // });

    this.logger.verbose(
      `Read flights: total: ${this.tickets.ids.length}, valid: ${valid.length}, now: ${new Date(now).toISOString()}`,
    );
    return valid;
  }
}
