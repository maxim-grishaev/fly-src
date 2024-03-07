import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { getId, normaliseArray } from './lib/normaliseArray';

@Controller()
export class RootController {
  constructor(private readonly db: DatabaseService) {}

  @Get()
  async getFlights() {
    const allFlights = await this.db.readAllValidFlights();
    return normaliseArray(allFlights, getId);
  }
}
