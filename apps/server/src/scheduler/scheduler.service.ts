import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  ConcreteVensdorConfig,
  getVendorConfig,
} from '../config/configuration';
import { mergeConfig } from '../config/mergeConfig';
import { again } from '../lib/again';
import { AsyncTask, TaskerService } from './tasker.service';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private cfg = mergeConfig(getVendorConfig());
  private readonly logger: Logger;

  constructor(private readonly taskSvc: TaskerService) {
    this.logger = new Logger(SchedulerService.name);
  }

  /**
   * Fetches flights from all vendors and schedules future fetches
   */
  async onModuleInit() {
    this.logger.log('onModuleInit', SchedulerService.name);

    await Promise.allSettled(
      this.cfg.map((cfg, idx) => this.initAsyncTaskByCfg(cfg, idx)),
    );
  }

  /**
   * Fetches flights one cofig from one config item and schedules future fetches
   */
  private async initAsyncTaskByCfg(cfg: ConcreteVensdorConfig, idx: number) {
    const task = this.taskSvc.createAsyncTask(cfg, idx);
    await this.prefetch(task);
    this.schedule(task);
  }

  private async runTask(task: AsyncTask) {
    return await again(task.run, {
      retries: task.cfg.retryAttempts,
      backoff: task.cfg.retryBackoff,
      timeout: task.cfg.timeout,
    });
  }

  private async prefetch(task: AsyncTask) {
    this.logger.log(task.msg('Prefetch'));
    await this.runTask(task)
      .then(() => this.logger.debug(task.msg('Prefetch OK!')))
      .catch(err => this.logger.warn(task.msg('Prefetch failed', err)));
  }

  // TODO: cancellation
  private schedule(task: AsyncTask) {
    const update = async () => {
      this.logger.debug(task.msg('Run scheduled task...'));
      await this.runTask(task)
        .then(() => this.logger.log(task.msg('Scheduled task OK!')))
        .catch(err => this.logger.warn(task.msg('Scheduled task failed', err)))
        .finally(() => this.schedule(task));
    };

    this.logger.verbose(task.msg('Schedule task', task.cfg.refteshAfterMs));
    setTimeout(update, task.cfg.refteshAfterMs);
  }
}
