import { fetchPowerusRaw } from './fetchPowerusRaw';
import { normaliseFlightResponse } from './normaliseResponse';
import { PowerusConfig, PowerusResp } from './powerus.types';

export const fetchOneSource = async (cfg: PowerusConfig['merged']) => {
  const resp: PowerusResp = await fetchPowerusRaw(cfg).catch((e: unknown) => {
    console.error(`Failed to fetch ${JSON.stringify(cfg)}`, e);
    throw e;
  });
  return normaliseFlightResponse(resp, cfg.cacheTTL);
};
