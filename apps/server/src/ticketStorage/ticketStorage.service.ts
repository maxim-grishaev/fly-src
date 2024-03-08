import { Injectable, Logger } from '@nestjs/common';
import { Ticket } from '../model/ticket.type';
import { APIIdTable } from '../lib/APIIdTable';

// Comments are for illustration purposes only
// It shows can we normalise / denormalise data,
// for example to store it in a (relational) database
// Although, depending on the use case,
// it might be faster to store in non-normalised form, like in Redis / MongoDB

// interface TTFLink {
//   ticketId: string;
//   flightId: string;
// }

@Injectable()
export class TicketStorageService {
  private readonly logger: Logger;
  private tickets = APIIdTable.createByArray(
    [] as Ticket<string>[],
    APIIdTable.getId,
  );

  // Normalised version:
  // private flights = APIIdTable.createByArray(
  //   [] as TicketFlight[],
  //   APIIdTable.getId,
  // );
  // private ticketToFlight = APIIdTable.createByArray([] as TTFLink[], l =>
  //   [l.ticketId, l.flightId].join('->'),
  // );

  constructor() {
    const id = (Date.now() + Math.random()).toString(36);
    this.logger = new Logger([TicketStorageService.name, id].join(': '));
  }

  async writeMany(tickets: Ticket[]) {
    this.logger.debug(`Saving flights ${tickets.length}`);

    // Normalised version:
    // const allFlights = tickets.flatMap(t => t.flights);
    // allFlights.forEach(flt => this.flights.write(flt));
    // const links = tickets.flatMap(t =>
    //   t.flights.map(f => ({ ticketId: t.id, flightId: f.id })),
    // );
    // links.forEach(lnk => this.ticketToFlight.write(lnk));

    await Promise.all(tickets.map(tkt => this.tickets.write(tkt)));
    this.logger.log(`Saved! ${this.tickets.ids.length}`);
  }

  async readAllValid() {
    const now = Date.now();
    const valid = this.tickets.select(
      f => new Date(f.staleAfter).getTime() > now,
    );

    // Normalised version:
    // valid.forEach(t => {
    //   t.flights = this.ticketToFlight
    //     .select(l => l.ticketId === t.id)
    //     .map(l => l.flightId)
    //     .map(id => this.flights.byId[id]);
    // });

    this.logger.verbose(
      `Read flights: total: ${this.tickets.ids.length}, valid: ${valid.length}, now: ${new Date(now).toISOString()}`,
    );
    return valid;
  }

  async readOne(id: string) {
    return this.tickets.byId[id];
  }
}
