import { RootController } from './app.controller';
import { DatabaseService } from './database/database.service';
import { MOCK_FLIGHT_1, MOCK_FLIGHT_2 } from './flight/flight.mock';
import { getId, normaliseArray } from './lib/normaliseArray';

const DEFAULT_RESPONSE = [MOCK_FLIGHT_2, MOCK_FLIGHT_1];
describe('AppController', () => {
  let appController: RootController;
  const getFlights = jest.fn().mockReturnValue(DEFAULT_RESPONSE);

  beforeEach(async () => {
    appController = new RootController({
      readAllValidFlights: async () => getFlights(),
    } as DatabaseService);
  });

  describe('root', () => {
    it('reads and normalises data', () => {
      expect(appController.getFlights()).resolves.toEqual(
        normaliseArray(DEFAULT_RESPONSE, getId),
      );

      getFlights.mockReturnValueOnce([MOCK_FLIGHT_2]);
      expect(appController.getFlights()).resolves.toEqual(
        normaliseArray([MOCK_FLIGHT_2], getId),
      );
    });
  });
});
