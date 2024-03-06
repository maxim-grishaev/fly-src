import * as crypto from 'crypto';
import { Flight } from '../flight.type';
import { toMonetary } from '../lib/toMonetary';
import { PowerusRespSlice } from './powerus.types';

export const normaliseFlight = (
  data: PowerusRespSlice,
  price: number,
): Flight => {
  const id = crypto
    .createHash('shake256', {
      outputLength: 8,
    })
    .update(
      [
        data.flight_number,
        data.departure_date_time_utc,
        data.origin_name,
        data.destination_name,
      ].join('\n'),
    )
    .digest('hex');

  return {
    id,
    source: 'powerus',
    price: toMonetary(price, 'EUR'),
    arrivalTime: new Date(data.arrival_date_time_utc),
    departureTime: new Date(data.departure_date_time_utc),
    duration: data.duration,
    flightNumber: data.flight_number,
    fromPlace: data.origin_name,
    toPlace: data.destination_name,
  };
};
