import { Module } from '@nestjs/common';
import { TicketStorageService } from './ticketStorage.service';

@Module({
  controllers: [],
  providers: [TicketStorageService],
  exports: [TicketStorageService],
})
export class TicketStorageModule {}
