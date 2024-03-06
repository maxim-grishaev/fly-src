import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PowerusService } from './powerus/powerus.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PowerusService],
})
export class AppModule {}
