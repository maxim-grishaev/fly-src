import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { PowerusService } from '../powerus/powerus.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SchedulerService, PowerusService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
