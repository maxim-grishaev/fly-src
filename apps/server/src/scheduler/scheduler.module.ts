import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { PowerusService } from '../vendorPowerUs/powerus.service';
import { TicketStorageModule } from '../ticketStorage/ticketStorage.module';
import { TaskerService } from './tasker.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [TicketStorageModule, PrismaModule],
  providers: [SchedulerService, TaskerService, PowerusService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
