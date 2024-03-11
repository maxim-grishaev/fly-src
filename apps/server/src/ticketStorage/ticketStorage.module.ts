import { Module } from '@nestjs/common';
import { TicketStorageService } from './ticketStorage.service';
import { PrismaService } from './prisma.service';

@Module({
  controllers: [],
  providers: [TicketStorageService, PrismaService],
  // TODO exrtact Prisma to a separate module
  exports: [TicketStorageService, PrismaService],
})
export class TicketStorageModule {}
