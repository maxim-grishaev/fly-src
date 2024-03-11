import { Inject, Injectable, Logger } from '@nestjs/common';
import { PowerusService } from './powerus.service';
import { TicketStorageService } from '../ticketStorage/ticketStorage.service';
import { Prisma } from '@prisma/client';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { PrismaService } from '../prisma/prisma.service';

type GetLogMessasge = (msg: string, data?: unknown) => string;
export type AsyncTask = {
  id: string;
  run: () => Promise<void>;
  message: GetLogMessasge;
  schedulerCfg: Prisma.SchedulerTaskGetPayload<null>;
};

@Injectable()
export class TaskerService {
  private readonly logger = new Logger(TaskerService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly ticketSvc: TicketStorageService,
    private readonly db: PrismaService,
    private readonly vndPowerusSvc: PowerusService,
  ) {}

  async selectTasks(): Promise<AsyncTask[]> {
    const pwrTasksDb = await this.db.powerusTask.findMany({
      include: { schedulerTask: true },
    });
    const tasks = pwrTasksDb.map((pwr): AsyncTask => this.createPwrUsTask(pwr));
    this.logger.log(`🔎 Tasks found: ${tasks.map(t => t.id).join(', ')}`);
    return tasks;
  }

  createPwrUsTask(
    pwr: Prisma.PowerusTaskGetPayload<{ include: { schedulerTask: true } }>,
  ): AsyncTask {
    const taskId = ['powerUs', pwr.id, pwr.schedulerTask.id].join('.');
    const message: GetLogMessasge = (msg, data) =>
      `[${taskId}] ${msg} ${data ? JSON.stringify(data) : ''}`;

    return {
      id: taskId,
      run: async () => {
        const data = await this.vndPowerusSvc.fetchSource(
          pwr.url,
          pwr.cacheTTL,
        );
        this.logger.verbose(
          message(`Fetched OK! ${data.length} items from ${pwr.url}`),
        );
        // Here we reset the entire cache
        // but better strategy may be implemented, e.g. add cache keys to the task
        this.cacheManager.reset();
        await this.ticketSvc.writeMany(data);
      },
      message,
      schedulerCfg: pwr.schedulerTask,
    };
  }
}
