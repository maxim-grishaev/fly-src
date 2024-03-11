import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SchedulerModule } from './scheduler/scheduler.module';
import { TicketStorageModule } from './ticketStorage/ticketStorage.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    SchedulerModule,
    TicketStorageModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
