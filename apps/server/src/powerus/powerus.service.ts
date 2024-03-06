import { Injectable } from '@nestjs/common';
import { VendorsService } from '../vendors/vendors.service';
import { selectFlights } from './selectFlights';
import { fetchOneSource } from './fetchOneSource';

@Injectable()
export class PowerusService {
  constructor(private readonly vnd: VendorsService) {}

  async fetchAllFlights() {
    return selectFlights(this.vnd.getByVendorId('powerUs'), fetchOneSource);
  }
}
