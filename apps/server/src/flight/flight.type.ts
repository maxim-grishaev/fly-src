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
  cacheTTL: number;
  validUntil: string;
}
