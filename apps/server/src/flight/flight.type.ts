import { WithVendorID } from '../config/config.types';
import { Monetary } from '../lib/toMonetary';

export interface Flight<V extends string = string> extends WithVendorID<V> {
  id: string;

  price: Monetary;
  fromPlace: string;
  toPlace: string;
  departureTime: Date;
  arrivalTime: Date;
  flightDuration: number;
  flightNumber: string;

  cacheTTL: number;
  validUntil: Date;
}
