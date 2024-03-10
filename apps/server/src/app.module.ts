import { Module } from '@nestjs/common';
import { RootController } from './app.controller';
import { SchedulerModule } from './scheduler/scheduler.module';
import { TicketStorageModule } from './ticketStorage/ticketStorage.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    SchedulerModule,
    TicketStorageModule,
  ],
  controllers: [RootController],
  providers: [],
})
export class AppModule {}
