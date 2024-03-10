import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { TicketStorageService } from './ticketStorage/ticketStorage.service';
import { APIIdTable } from './model/APIIdTable';
import { APITicket } from './model/APITicket';
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
    const allTickets = await this.db.readAllValid();

    // Here we can hide / enrich some data for the clien
    return APIOkWithMeta.create({
      data: APIIdTable.createByArray(
        allTickets.map(APITicket.create),
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
      data: flight ? APITicket.create(flight) : null,
      perfStart,
    });
  }
}
