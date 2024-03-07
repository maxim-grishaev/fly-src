import { Test, TestingModule } from '@nestjs/testing';
import { TicketStorageService } from './ticketStorage.service';

describe('DatabaseService', () => {
  let service: TicketStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketStorageService],
    }).compile();

    service = module.get<TicketStorageService>(TicketStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
