import { again } from '../lib/again';
import { PowerusConfig, PowerusResp } from './powerus.types';

export const isPowerusResp = (data: unknown): data is PowerusResp =>
  data !== null &&
  typeof data === 'object' &&
  'flights' in data &&
  Array.isArray(data.flights);

const getRetriesByAttempts = (attempts: number | undefined) =>
  attempts === undefined || attempts < 2 ? 1 : attempts - 1;

export const fetchPowerusRaw = async (cfg: PowerusConfig['merged']) =>
  await again(() => fetch(cfg.url), {
    retries: getRetriesByAttempts(cfg.fetchAttempts),
    backoff: cfg.fetchBackoff,
    timeout: cfg.fetchTimeout,
  })
    .then(res => res.json())
    .then(json => {
      if (!isPowerusResp(json)) {
        console.log(`Invalid response from ${cfg.url}`, json);
        throw new Error(`Invalid response from ${cfg.url}`);
      }
      return json;
    });
