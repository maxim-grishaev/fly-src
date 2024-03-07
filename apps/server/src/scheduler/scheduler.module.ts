import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { PowerusService } from '../vendorPowerUs/powerus.service';
import { TicketStorageModule } from '../ticketStorage/ticketStorage.module';
import { TaskerService } from './tasker.service';

@Module({
  imports: [TicketStorageModule],
  providers: [SchedulerService, TaskerService, PowerusService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
