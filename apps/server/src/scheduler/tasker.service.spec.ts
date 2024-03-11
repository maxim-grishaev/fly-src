import { Test, TestingModule } from '@nestjs/testing';
import { TicketStorageModule } from '../ticketStorage/ticketStorage.module';
import { SchedulerModule } from './scheduler.module';
import { CacheModule } from '@nestjs/cache-manager';
import { TaskerService } from './tasker.service';

describe('SchedulerService', () => {
  let service: TaskerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TicketStorageModule,
        SchedulerModule,
        CacheModule.register({ isGlobal: true }),
      ],
      providers: [],
    }).compile();

    service = module.get(TaskerService);
  });

  it('should be defined', () => {
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
    ).toMatchInlineSnapshot(`
{
  "id": "powerUs.111.222",
  "message": [Function],
  "run": [Function],
  "schedulerCfg": {
    "backoffMs": 1000,
    "id": 222,
    "refteshAfterMs": 999,
    "retryAttempts": 3,
    "timeoutMs": 1000,
    "vendorId": "abc",
  },
}
`);
  });

  // TODO: write more tests
});
