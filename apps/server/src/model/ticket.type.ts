import { WithVendorID } from '../config/config.types';
import { Monetary } from '../lib/toMonetary';

export interface TicketFlight {
  id: string;
  fromPlace: string;
  fromTime: string;
  toPlace: string;
  toTime: string;
  flightDuration: number;
  flightNumber: string;
}

export interface Ticket<V extends string = string> extends WithVendorID<V> {
  id: string;
  price: Monetary;
  flights: TicketFlight[];
  // Not necessary, but assuming cache can have different values
  // depending on the source + easier to investigate
  cacheTTLMs: number;
  // Used to filter out stale data
  staleAfter: string;
}
