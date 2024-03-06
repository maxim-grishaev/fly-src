import { Flight } from '../flight.type';
import { PowerusConfig } from './powerus.types';

type Cfg = PowerusConfig['merged'];
export const selectFlights = async (
  vnd: Array<Cfg>,
  fetchOneSource: (cfg: Cfg) => Promise<Flight[]>,
) => {
  const resps = await Promise.all(vnd.map(fetchOneSource));
  const now = Date.now();
  return resps
    .flatMap(flights => flights)
    .filter(it => it.validUntil.getTime() > now);
};
