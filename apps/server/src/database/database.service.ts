import { Injectable, Logger } from '@nestjs/common';
import { Flight } from '../flight/flight.type';
import { getId, normaliseArray } from '../lib/normaliseArray';

@Injectable()
export class DatabaseService {
  private flights = normaliseArray([] as Flight[], getId);
  private readonly logger: Logger;

  constructor() {
    const id = (Date.now() + Math.random()).toString(36);
    this.logger = new Logger([DatabaseService.name, id].join(': '));
  }

  async writeManyFlights(flights: Flight[]) {
    this.logger.log(`Saving flights ${flights.length}`);
    await Promise.all(flights.map(f => this._writeOneFlight(f)));
    this.logger.log(`Saved! ${this.flights.ids.length}`);
  }

  private _writeOneFlight(flight: Flight) {
    const hasItem = flight.id in this.flights.byId;
    if (!hasItem) {
      this.flights.ids.push(flight.id);
    }
    this.flights.byId[flight.id] = flight;
  }

  async readAllValidFlights() {
    const now = Date.now();
    const valid = this.flights.ids
      .map(id => this.flights.byId[id])
      .filter(f => f.validUntil.getTime() > now);
    this.logger.log(
      `Read flights: total: ${this.flights.ids.length}, valid: ${valid.length}, now: ${now}`,
    );
    return valid;
  }
}
