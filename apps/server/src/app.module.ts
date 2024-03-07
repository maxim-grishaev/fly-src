import { Module } from '@nestjs/common';
import { RootController } from './app.controller';
import { SchedulerModule } from './scheduler/scheduler.module';
import { TicketStorageModule } from './ticketStorage/ticketStorage.module';

@Module({
  imports: [SchedulerModule, TicketStorageModule],
  controllers: [RootController],
  providers: [],
})
export class AppModule {}
