import { Injectable } from '@nestjs/common';
// import { PowerusConfig } from './powerus.types';
// import { again } from '../lib/again';

@Injectable()
export class PowerusService {
  // Inject configs

  getHello(): string {
    return 'Hello World!';
  }

  // async fetchPowerus(cfg: PowerusConfig['merged']) {
  //   const retries =
  //     cfg.fetchAttempts === undefined || cfg.fetchAttempts < 2
  //       ? 1
  //       : cfg.fetchAttempts - 1;
  //   return again(() => fetch(cfg.url), {
  //     retries,
  //     backoff: cfg.fetchBackoff,
  //     timeout: cfg.fetchTimeout,
  //   })
  //     .then(res => res.json())
  //     .catch((e: unknown) => {
  //       console.error(`Failed to fetch ${JSON.stringify(cfg)}`, e);
  //       throw e;
  //     });
  // }
}
