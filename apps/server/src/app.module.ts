import { Module } from '@nestjs/common';
import { RootController } from './app.controller';
import { SchedulerModule } from './scheduler/scheduler.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [SchedulerModule, DatabaseModule],
  controllers: [RootController],
  providers: [],
})
export class AppModule {}
