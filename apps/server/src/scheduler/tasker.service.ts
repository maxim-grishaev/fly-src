import { Injectable, Logger } from '@nestjs/common';
import { PowerusService } from '../vendorPowerUs/powerus.service';
import { ConcreteVensdorConfig } from '../config/configuration';
import { TicketStorageService } from '../ticketStorage/ticketStorage.service';
import { assertUnreachable } from '../lib/assertUnreachable';

export type AsyncTaskRun = () => Promise<void>;
type GetLogMessasge = (msg: string, data?: unknown) => string;
export interface AsyncTask {
  run: AsyncTaskRun;
  msg: GetLogMessasge;
  cfg: ConcreteVensdorConfig;
  taskId: string;
}
type RunTask = (msg: GetLogMessasge) => Promise<unknown>;

@Injectable()
export class TaskerService {
  private readonly logger: Logger;

  constructor(
    private readonly dbSvc: TicketStorageService,
    private readonly vndPowerusSvc: PowerusService,
  ) {
    this.logger = new Logger(TaskerService.name);
  }

  public createTask(
    cfg: ConcreteVensdorConfig,
    idx: number,
    run: RunTask,
  ): AsyncTask {
    const taskId = [cfg.vendorId, idx].join(': ');
    const msg: GetLogMessasge = (msg, data) =>
      `[${taskId}] ${msg} ${data ? JSON.stringify(data) : ''}`;
    this.logger.verbose(msg('Task created', cfg));
    return {
      run: async () => {
        await run(msg);
      },
      cfg,
      msg,
      taskId,
    };
  }

  // Can be extracted into a separate service to separate scheruler logic from vendor logic
  public createAsyncTask(cfg: ConcreteVensdorConfig, idx: number): AsyncTask {
    const { vendorId } = cfg;
    switch (vendorId) {
      case 'powerUs':
        return this.createTask(cfg, idx, async () => {
          const data = await this.vndPowerusSvc.fetchSource(
            cfg.url,
            cfg.cacheTTL,
          );

          await this.dbSvc.writeMany(data);
        });
      // Only for illustration purposes
      case 'testVnd':
        return this.createTask(cfg, idx, async (msg: GetLogMessasge) => {
          this.logger.log(msg('Test vendor task', cfg));
        });
      default:
        return assertUnreachable(vendorId, 'Unknown vendorId');
    }
  }
}
