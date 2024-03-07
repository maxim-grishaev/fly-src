import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { getId, createIdTableByArray } from './lib/IdTable';

@Controller()
export class RootController {
  constructor(private readonly db: DatabaseService) {}

  @Get()
  async getFlights() {
    const allFlights = await this.db.readAllValidFlights();
    return createIdTableByArray(allFlights, getId);
  }
}
