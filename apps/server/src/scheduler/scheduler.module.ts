import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { PowerusService } from '../powerus/powerus.service';
import { DatabaseModule } from '../database/database.module';
import { TaskerService } from './tasker.service';

@Module({
  imports: [DatabaseModule],
  providers: [SchedulerService, TaskerService, PowerusService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
