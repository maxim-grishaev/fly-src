import { Module } from '@nestjs/common';
import { TicketStorageService } from './ticketStorage.service';
import { PrismaService } from './prisma.service';

@Module({
  controllers: [],
  providers: [TicketStorageService, PrismaService],
  exports: [TicketStorageService],
})
export class TicketStorageModule {}
