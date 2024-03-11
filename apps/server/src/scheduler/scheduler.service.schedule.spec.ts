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
  retryAttempts: 2,
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
  testPrefetch() {
    return super.prefetch(mockTask);
  }
}

describe('SchedulerService', () => {
  let service: SchedulerServiceTest;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TicketStorageModule, SchedulerModule, CacheModule.register()],
      providers: [SchedulerServiceTest, TaskerService],
    })
      .overrideProvider(TaskerService)
      .useValue({ selectTasks: async () => [] })
      .compile();

    service = module.get(SchedulerServiceTest);
  });

  // Testing it's scheduling the next run
  describe('.schedule', () => {
    const mockOnEnd = jest.fn();

    it.each([
      ['schedule next if all good', 1, () => null],
      [
        'retry next if run fails, %s times, but call onEnd only once',
        mockTask.schedulerCfg.retryAttempts + 1,
        () => mockTaskRun.mockRejectedValue(new Error('test')),
      ],
    ])('', async (_, n, init) => {
      jest.clearAllMocks();
      const flushPromises = () => new Promise(res => process.nextTick(res));
      jest.useFakeTimers({
        legacyFakeTimers: true,
      });

      init();
      service.schedule(mockTask, mockOnEnd);
      expect(mockTaskRun).not.toHaveBeenCalled();

      jest.advanceTimersByTime(mockSchedulerCfg.refteshAfterMs);

      await flushPromises();
      // More than "needed"
      let i = 0;
      while (i++ < mockTask.schedulerCfg.retryAttempts + 2) {
        await flushPromises();
        jest.runAllTimers();
      }

      await expect(mockTaskRun).toHaveBeenCalledTimes(n);
      await expect(mockOnEnd).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });
  });
});
