import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PowerusService } from '../powerus/powerus.service';
import {
  ConcreteVensdorConfig,
  getVendorConfig,
} from '../config/configuration';
import { mergeConfig } from '../config/mergeConfig';
import { Flight } from '../flight/flight.type';
import { DatabaseService } from '../database/database.service';
import { assertUnreachable } from '../lib/assertUnreachable';
import { again } from '../lib/again';

type FetchFlightsFn = () => Promise<Flight[]>;
const getRetriesByAttempts = (attempts: number | undefined) =>
  attempts === undefined || attempts < 2 ? 0 : attempts;

type DebugLog = (msg: string, data?: unknown) => void;
type Ctx = { debug: DebugLog };

@Injectable()
export class SchedulerService implements OnModuleInit {
  private cfg = mergeConfig(getVendorConfig());
  private readonly logger: Logger;

  constructor(
    // TODO: implement
    private readonly dbSvc: DatabaseService,
    private readonly vndPwrUs: PowerusService,
  ) {
    this.logger = new Logger(SchedulerService.name);
  }

  /**
   * Fetches flights from all vendors and schedules future fetches
   */
  async onModuleInit() {
    this.logger.log('onModuleInit', SchedulerService.name);

    await Promise.allSettled(
      this.cfg.map((cfg, idx) =>
        this.prefetchByCfg(cfg, [cfg.vendorId, idx].join(': ')),
      ),
    );
  }

  /**
   * Fetches flights one cofig from one config item and schedules future fetches
   */
  prefetchByCfg(cfg: ConcreteVensdorConfig, debugId: string) {
    const debugLog: DebugLog = (msg, data) =>
      this.logger.log(
        `[${debugId}] ${msg} ${data ? JSON.stringify(data) : ''}`,
      );
    const ctx = { debug: debugLog };

    const fetchFlights = this.createFlightsFetcher(cfg, ctx);
    const fetchAndLog = () => {
      ctx.debug('Fetching');
      return fetchFlights();
    };

    return this.prefetchByFn(fetchAndLog, cfg, ctx);
  }

  async prefetchByFn(fn: FetchFlightsFn, cfg: ConcreteVensdorConfig, ctx: Ctx) {
    ctx.debug('prefetch');
    const data = await this.callWithRetry(fn, cfg, ctx);
    await this.dbSvc.writeManyFlights(data);
    ctx.debug('prefetch OK!');
    void this.schedule(fn, cfg, ctx);
    return true;
  }

  /**
   * Fetches flights from one config item with retries stated in config
   */
  async callWithRetry(
    fn: FetchFlightsFn,
    cfg: ConcreteVensdorConfig,
    ctx: Ctx,
  ): Promise<Flight[]> {
    ctx.debug('callWithRetry');
    return again(fn, {
      retries: getRetriesByAttempts(cfg.retryAttempts ?? 2),
      backoff: cfg.retryBackoff,
      timeout: cfg.timeout,
    });
  }

  schedule(fn: FetchFlightsFn, cfg: ConcreteVensdorConfig, ctx: Ctx) {
    // TODO: implement error handling, etc
    ctx.debug('Scheduled', { ttl: cfg.cacheTTL - cfg.refteshOverlapMs });
    setInterval(fn, cfg.cacheTTL - cfg.refteshOverlapMs);
  }

  createFlightsFetcher(cfg: ConcreteVensdorConfig, ctx: Ctx): FetchFlightsFn {
    const { vendorId } = cfg;
    switch (vendorId) {
      case 'powerUs':
        ctx.debug('createFlightsFetcher', { url: cfg.url });
        return () => this.vndPwrUs.fetchSource(cfg.url, cfg.cacheTTL);
      case 'testVnd':
        ctx.debug('createFlightsFetcher');
        return () => Promise.resolve([]);
      default:
        return assertUnreachable(vendorId, 'Unknown vendorId');
    }
  }
}
