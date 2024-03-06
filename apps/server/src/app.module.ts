import { Module } from '@nestjs/common';
import { RootController } from './app.controller';
import { PowerusService } from './powerus/powerus.service';
import { HelloService } from './hello/hello.service';
import { VendorsService } from './vendors/vendors.service';

@Module({
  imports: [],
  controllers: [RootController],
  providers: [PowerusService, HelloService, VendorsService],
})
export class AppModule {}
