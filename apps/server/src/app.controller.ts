import { Controller, Get } from '@nestjs/common';
import { PowerusService } from './powerus/powerus.service';

@Controller()
export class AppController {
  constructor(private readonly pwrUs: PowerusService) {}

  @Get()
  getHello(): string {
    return this.pwrUs.getHello();
  }

  // @Get('s1')
  // async getS1(): Promise<string> {
  //   return await this.pwrUs
  //     .fetchPowerus({
  //       vendorId: 'powerus',
  //       url: 'https://coding-challenge.powerus.de/flight/source1',
  //       cacheTTL: 60 * 60 * 1000, // 1h
  //       fetchAttempts: 3,
  //     })
  //     .then(JSON.stringify);
  // }
}
