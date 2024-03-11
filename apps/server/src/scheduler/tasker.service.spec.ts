import { Test, TestingModule } from '@nestjs/testing';
import { TicketStorageModule } from '../ticketStorage/ticketStorage.module';
import { SchedulerModule } from './scheduler.module';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { TaskerService } from './tasker.service';
import { PrismaService } from '../prisma/prisma.service';
import { PowerusService } from './powerus.service';
import { TicketStorageService } from '../ticketStorage/ticketStorage.service';

describe('SchedulerService', () => {
  let service: TaskerService;
  const MOCKS = {
    powerUsTasks: {
      fetchMany: jest.fn(),
    },
    powerUsSvc: {
      fetchSource: jest.fn(),
    },
    prisma: {
      $transaction: jest.fn(),
    },
    ticketSvc: {
      writeMany: jest.fn(),
    },
    cache: {
      reset: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TicketStorageModule,
        SchedulerModule,
        CacheModule.register({ isGlobal: true }),
      ],
      providers: [PowerusService],
    })
      .overrideProvider(CACHE_MANAGER)
      .useValue(MOCKS.cache)
      .overrideProvider(PrismaService)
      .useValue({
        $transaction: MOCKS.prisma.$transaction,
        powerusTask: {
          findMany: MOCKS.powerUsTasks.fetchMany.mockResolvedValue([]),
        },
      })
      .overrideProvider(PowerusService)
      .useValue({
        fetchSource: MOCKS.powerUsSvc.fetchSource.mockResolvedValue([]),
      })
      .overrideProvider(TicketStorageService)
      .useValue({
        writeMany: MOCKS.ticketSvc.writeMany.mockResolvedValue(undefined),
      })
      .compile();

    service = module.get(TaskerService);
  });

  describe('selectTasks', () => {
    // Check we didn't forget to implement the selectTasks method
    it.each(['powerusTask'])('selects tasks from %p', async () => {
      await service.selectTasks();
      expect(MOCKS.powerUsTasks.fetchMany).toHaveBeenCalledTimes(1);
      expect(MOCKS.powerUsTasks.fetchMany).toHaveBeenCalledWith({
        include: { schedulerTask: true },
      });
    });
  });

  describe('Vendors', () => {
    describe('createPwrUsTask', () => {
      it('returns the AsyncTask', () => {
        expect(
          service.createPwrUsTask({
            id: 111,
            cacheTTL: 1000,
            schedulerTask: {
              id: 222,
              backoffMs: 1000,
              refteshAfterMs: 999,
              retryAttempts: 3,
              timeoutMs: 1000,
              vendorId: 'abc',
            },
            taskId: 1,
            url: 'http://localhost:3000',
          }),
        ).toEqual({
          id: 'powerUs.111.222',
          message: expect.any(Function),
          run: expect.any(Function),
          schedulerCfg: {
            backoffMs: 1000,
            id: 222,
            refteshAfterMs: 999,
            retryAttempts: 3,
            timeoutMs: 1000,
            vendorId: 'abc',
          },
        });
      });
      it('calls run(): fetch the data, save to DB and reset the cache', async () => {
        const task = service.createPwrUsTask({
          id: 123,
          schedulerTask: {
            id: 234,
            backoffMs: 1000,
            refteshAfterMs: 999,
            retryAttempts: 3,
            timeoutMs: 1000,
            vendorId: 'abc',
          },
          taskId: 1,
          cacheTTL: 1337,
          url: 'http://localhost:3000?test=1',
        });
        await expect(task.run()).resolves.toBe(undefined);
        expect(MOCKS.powerUsSvc.fetchSource).toHaveBeenCalledTimes(1);
        expect(MOCKS.powerUsSvc.fetchSource).toHaveBeenCalledWith(
          'http://localhost:3000?test=1',
          1337,
        );
        expect(MOCKS.cache.reset).toHaveBeenCalledTimes(1);
        expect(MOCKS.ticketSvc.writeMany).toHaveBeenCalledTimes(1);
      });
    });
  });
});
