import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { TicketStorageModule } from '../ticketStorage/ticketStorage.module';
import { SchedulerModule } from './scheduler.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AsyncTask, TaskerService } from './tasker.service';

const mockTaskRun = jest.fn();
const mockSchedulerCfg: AsyncTask['schedulerCfg'] = {
  id: 123,
  backoffMs: 1,
  retryAttempts: 3,
  refteshAfterMs: 99,
  timeoutMs: 100,
  vendorId: 'testVnd',
};
const mockTask: AsyncTask = {
  id: 't_123',
  message: () => 'test',
  run: mockTaskRun,
  schedulerCfg: mockSchedulerCfg,
};
class SchedulerServiceTest extends SchedulerService {
  async onModuleInit(): Promise<void> {}
  async testOnModuleInit(): Promise<void> {
    return super.onModuleInit();
  }
  testPrefetch() {
    return super.prefetch(mockTask);
  }
}

const mockSelectTasks = jest.fn().mockResolvedValue([]);
describe('SchedulerService', () => {
  let service: SchedulerServiceTest;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TicketStorageModule, SchedulerModule, CacheModule.register()],
      providers: [SchedulerServiceTest, TaskerService],
    })
      .overrideProvider(TaskerService)
      .useValue({ selectTasks: mockSelectTasks })
      .compile();

    service = module.get(SchedulerServiceTest);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('runTask', () => {
    it('runTask', async () => {
      await service.runTask(mockTask);
      expect(mockTaskRun).toHaveBeenCalledTimes(1);
    });
    // Implementation details are at `again.test.ts`. Here we just do basic validation
    it('retries runTask', async () => {
      mockTaskRun.mockRejectedValueOnce({ weird: 'exception' });
      await expect(service.runTask(mockTask)).resolves.not.toThrow();
      expect(mockTaskRun).toHaveBeenCalledTimes(2);
    });
  });

  describe('prefetch', () => {
    it('smoke test', async () => {
      await service.testPrefetch();
      expect(mockTaskRun).toHaveBeenCalledTimes(1);
    });
    // We dont want to crash the app if single task fails
    it('run fails', async () => {
      mockTaskRun.mockRejectedValue({ some: 'issue' });
      await expect(service.testPrefetch()).resolves.not.toThrow();
      mockTaskRun.mockResolvedValue(undefined);
    });
  });

  describe('onModuleInit', () => {
    it('smoke test', async () => {
      await expect(service.testOnModuleInit()).resolves.not.toThrow();
    });

    it('calls selectTask, prefetches and schedules', async () => {
      jest.useFakeTimers({ legacyFakeTimers: true });

      mockSelectTasks.mockResolvedValue([mockTask]);
      await service.testOnModuleInit();

      expect(mockTaskRun).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(mockSchedulerCfg.refteshAfterMs);
      await new Promise(res => process.nextTick(res));
      expect(mockTaskRun).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(mockSchedulerCfg.refteshAfterMs);
      await new Promise(res => process.nextTick(res));
      expect(mockTaskRun).toHaveBeenCalledTimes(3);

      jest.useRealTimers();
    });
  });
});
