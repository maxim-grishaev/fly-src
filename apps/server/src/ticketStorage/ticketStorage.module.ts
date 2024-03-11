import { Module } from '@nestjs/common';
import { TicketStorageService } from './ticketStorage.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TicketStorageService],
  exports: [TicketStorageService],
})
export class TicketStorageModule {}
