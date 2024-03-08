import { RootController } from './app.controller';
import { TicketStorageService } from './ticketStorage/ticketStorage.service';
import { MOCK_TICKET_1, MOCK_TICKET_2 } from './model/ticket.mock';
import { getId, createIdTableByArray } from './lib/createIdTableByArray';

const DEFAULT_RESPONSE = [MOCK_TICKET_2, MOCK_TICKET_1];
describe('AppController', () => {
  let appController: RootController;
  const getFlights = jest.fn().mockReturnValue(DEFAULT_RESPONSE);

  beforeEach(async () => {
    appController = new RootController({
      readAllValid: async () => getFlights(),
    } as TicketStorageService);
  });

  describe('root', () => {
    it('reads and normalises data', () => {
      expect(appController.getAllTickets()).resolves.toEqual(
        createIdTableByArray(DEFAULT_RESPONSE, getId),
      );

      getFlights.mockReturnValueOnce([MOCK_TICKET_2]);
      expect(appController.getAllTickets()).resolves.toEqual(
        createIdTableByArray([MOCK_TICKET_2], getId),
      );
    });
  });
});
