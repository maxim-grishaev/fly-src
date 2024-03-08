import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { TicketStorageService } from './ticketStorage/ticketStorage.service';
import { APIIdTable } from './lib/APIIdTable';
import { APITicket } from './model/api.types';
import { APIOkWithMeta } from './model/api.lib';
import { ApiExtraModels, ApiOkResponse } from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class RootController {
  constructor(private readonly db: TicketStorageService) {}

  @Get()
  @ApiExtraModels(APITicket)
  @ApiOkResponse({
    type: APIOkWithMeta.swagger(APIIdTable.swagger(APITicket)),
  })
  async getAllTickets() {
    const perfStart = performance.now();
    const allFlights = await this.db.readAllValid();

    // Here we can hide / enrich some data for the clien
    return APIOkWithMeta.create({
      data: APIIdTable.createByArray(
        allFlights.map(APITicket.create),
        APIIdTable.getId,
      ),
      perfStart,
    });
  }

  @Get('ticket/:id')
  @ApiExtraModels(APITicket)
  @ApiOkResponse({
    type: APIOkWithMeta.swagger(APITicket),
  })
  async getTicketById(@Param('id') id: string) {
    const perfStart = performance.now();
    const flight = await this.db.readOne(id);

    return APIOkWithMeta.create({
      data: APITicket.create(flight),
      perfStart,
    });
  }
}
