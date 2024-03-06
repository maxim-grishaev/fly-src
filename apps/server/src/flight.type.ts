import { Monetary } from './lib/toMonetary';
import { PowerusConfig } from './powerus/powerus.types';

export interface Flight {
  id: string;
  source: PowerusConfig['vendorId'];
  //
  price: Monetary;
  fromPlace: string;
  toPlace: string;
  departureTime: Date;
  arrivalTime: Date;
  flightDuration: number;
  flightNumber: string;
  //
  cacheTTL: number;
  validUntil: Date;
}
