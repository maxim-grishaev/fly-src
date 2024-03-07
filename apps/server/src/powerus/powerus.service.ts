import { Injectable } from '@nestjs/common';
import { fetchSource } from './fetchSource';
import { normaliseFlightResponse } from './normaliseFlightResponse';
import { PowerusResp } from './powerus.types';

@Injectable()
export class PowerusService {
  constructor() {}

  async fetchSource(url: string, cacheTTL: number) {
    const resp: PowerusResp = await fetchSource(url);
    return normaliseFlightResponse(resp, cacheTTL);
  }
}
