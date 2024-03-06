import { Controller, Get } from '@nestjs/common';
import { PowerusService } from './powerus/powerus.service';
import { getId, normaliseArray } from './lib/normaliseArray';
import { HelloService } from './hello/hello.service';

@Controller()
export class RootController {
  constructor(
    private readonly pwrUs: PowerusService,
    private readonly hello: HelloService,
  ) {}

  @Get('hello')
  helloWorld(): string {
    return this.hello.world();
  }

  @Get()
  async getPowerUs(): Promise<string> {
    const allFlights = await this.pwrUs.fetchAllFlights();
    const normData = normaliseArray(allFlights, getId);
    return JSON.stringify(normData, null, 2);
  }
}
