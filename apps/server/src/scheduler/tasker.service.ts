import { Injectable, Logger } from '@nestjs/common';
import { PowerusService } from '../vendorPowerUs/powerus.service';
import { TicketStorageService } from '../ticketStorage/ticketStorage.service';
import { PrismaService } from '../ticketStorage/prisma.service';
import { Prisma } from '@prisma/client';

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
        await this.ticketSvc.writeMany(data);
      },
      message,
      schedulerCfg: pwr.schedulerTask,
    };
  }
}
