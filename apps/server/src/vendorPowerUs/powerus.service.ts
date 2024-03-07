import { Injectable } from '@nestjs/common';
import { fetchSource } from './fetchSource';
import { normaliseFlightResponse } from './normaliseFlightResponse';

@Injectable()
export class PowerusService {
  constructor() {}

  async fetchSource(url: string, cacheTTL: number) {
    const resp = await fetchSource(url);
    return normaliseFlightResponse(resp, cacheTTL);
  }
}
