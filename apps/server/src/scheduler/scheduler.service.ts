import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { again } from '../lib/again';
import { AsyncTask, TaskerService } from './tasker.service';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private tasks: AsyncTask[] = [];
  private readonly logger: Logger;

  constructor(private readonly taskSvc: TaskerService) {
    this.logger = new Logger(SchedulerService.name);
  }

  /**
   * Fetches flights from all vendors and schedules future fetches
   */
  async onModuleInit() {
    this.tasks = await this.taskSvc.selectTasks();
    await Promise.allSettled(
      this.tasks.map(async task => {
        await this.prefetch(task);
        this.schedule(task);
      }),
    );
  }

  private async runTask(task: AsyncTask) {
    return await again(task.run, {
      retries: task.schedulerCfg.retryAttempts,
      backoff: task.schedulerCfg.backoffMs ?? undefined,
      timeout: task.schedulerCfg.timeoutMs ?? undefined,
    });
  }

  private async prefetch(task: AsyncTask) {
    this.logger.log(task.message('Prefetch'));
    await this.runTask(task)
      .then(() => this.logger.debug(task.message('Prefetch OK!')))
      .catch(err => this.logger.warn(task.message('Prefetch failed', err)));
  }

  private schedule(task: AsyncTask) {
    const update = async () => {
      this.logger.debug(task.message('Run scheduled task...'));
      await this.runTask(task)
        .then(() => this.logger.log(task.message('Scheduled task OK!')))
        .catch(err =>
          this.logger.warn(task.message('Scheduled task failed', err)),
        )
        .then(() => this.schedule(task));
    };

    this.logger.verbose(
      task.message('Schedule task', task.schedulerCfg.refteshAfterMs),
    );
    setTimeout(update, task.schedulerCfg.refteshAfterMs);
  }
}
