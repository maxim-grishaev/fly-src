import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { TicketStorageModule } from '../ticketStorage/ticketStorage.module';
import { SchedulerModule } from './scheduler.module';
import { CacheModule } from '@nestjs/cache-manager';
import { TaskerService } from './tasker.service';

describe('SchedulerService', () => {
  let service: SchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TicketStorageModule, SchedulerModule, CacheModule.register()],
      providers: [],
    })
      .overrideProvider(TaskerService)
      .useValue({ selectTasks: async () => [] })
      .compile();

    service = module.get(SchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: write more tests
});
