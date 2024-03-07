import { Controller, Get } from '@nestjs/common';
import { TicketStorageService } from './ticketStorage/ticketStorage.service';
import { getId, createIdTableByArray } from './lib/IdTable';

@Controller()
export class RootController {
  constructor(private readonly db: TicketStorageService) {}

  @Get()
  async getFlights() {
    const allFlights = await this.db.readAllValidFlights();
    return createIdTableByArray(allFlights, getId);
  }
}
