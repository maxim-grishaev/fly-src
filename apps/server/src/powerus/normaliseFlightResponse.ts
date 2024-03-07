import * as crypto from 'crypto';
import { Flight } from '../flight/flight.type';
import { toMonetary } from '../lib/toMonetary';
import { PowerusResp, PowerusRespSlice } from './powerus.types';

export const normaliseFlight = (
  data: PowerusRespSlice,
  price: number,
  cacheTTL: number,
): Flight => {
  const id = crypto
    .createHash('sha1')
    .update(
      [
        data.flight_number,
        data.departure_date_time_utc,
        data.origin_name,
        data.destination_name,
      ].join('\n'),
    )
    .digest('hex')
    .substring(0, 10);

  return {
    id,
    vendorId: 'powerUs',
    price: toMonetary(price, 'EUR'),
    arrivalTime: new Date(data.arrival_date_time_utc),
    departureTime: new Date(data.departure_date_time_utc),
    flightDuration: data.duration,
    flightNumber: data.flight_number,
    fromPlace: data.origin_name,
    toPlace: data.destination_name,
    validUntil: new Date(Date.now() + cacheTTL),
    cacheTTL,
  };
};

export const normaliseFlightResponse = (
  data: PowerusResp,
  cacheTTL: number,
): Flight[] =>
  data.flights.flatMap(item =>
    item.slices.map(slc => normaliseFlight(slc, item.price, cacheTTL)),
  );
