import { AppController } from './app.controller';
import { TicketStorageService } from './ticketStorage/ticketStorage.service';
import { MOCK_TICKET_1, MOCK_TICKET_2 } from './model/ticket.mock';
import { APIIdTable } from './model/APIIdTable';
import { CacheModule } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { TicketStorageModule } from './ticketStorage/ticketStorage.module';

const DEFAULT_RESPONSE = [MOCK_TICKET_2, MOCK_TICKET_1];

describe('AppController', () => {
  let appController: AppController;
  const readAllValid = jest.fn().mockReturnValue(DEFAULT_RESPONSE);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register(), TicketStorageModule],
      providers: [AppController],
    })
      .overrideProvider(TicketStorageService)
      .useValue({ readAllValid })
      .compile();

    appController = module.get(AppController);
  });

  describe('root', () => {
    it('reads and normalises data', async () => {
      const result = await appController.getAllTickets();
      expect(result.data).toEqual(
        APIIdTable.createByArray(DEFAULT_RESPONSE, APIIdTable.getId),
      );

      readAllValid.mockReturnValueOnce([MOCK_TICKET_2]);
      const result2 = await appController.getAllTickets();
      expect(result2.data).toEqual(
        APIIdTable.createByArray([MOCK_TICKET_2], APIIdTable.getId),
      );
    });
  });
});
