import { Flight } from '../flight.type';
import { PowerusResp } from './powerus.types';
import { normaliseFlight } from './normaliseFlight';

export const normaliseFlightResponse = (
  data: PowerusResp,
  cacheTTL: number,
): Flight[] =>
  data.flights.flatMap(item =>
    item.slices.map(slc => normaliseFlight(slc, item.price, cacheTTL)),
  );
