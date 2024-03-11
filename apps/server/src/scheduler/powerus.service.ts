import { Injectable } from '@nestjs/common';
import { fetchSource } from '../vendorPowerUs/fetchSource';
import { normaliseFlightResponse } from '../vendorPowerUs/normaliseFlightResponse';

@Injectable()
export class PowerusService {
  constructor() {}

  async fetchSource(url: string, cacheTTL: number) {
    const resp = await fetchSource(url);
    return normaliseFlightResponse(resp, cacheTTL);
  }
}
