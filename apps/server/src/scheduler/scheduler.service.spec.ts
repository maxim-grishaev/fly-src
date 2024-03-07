import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { DatabaseModule } from '../database/database.module';
import { SchedulerModule } from './scheduler.module';

describe('SchedulerService', () => {
  let service: SchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, SchedulerModule],
      providers: [],
    }).compile();

    service = module.get(SchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
