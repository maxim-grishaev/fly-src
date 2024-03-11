import { S1 } from './fixture.mock';
import {
  normaliseTicket,
  normaliseFlightResponse,
} from './normaliseFlightResponse';

describe('normaliseResponse', () => {
  it('should normalise response', () => {
    const result = normaliseFlightResponse(S1, 60 * 60 * 1000);
    expect(result).toMatchSnapshot();
  });
});

const nowOrig = Date.now;
Date.now = () => 123;
afterAll(() => {
  Date.now = nowOrig;
});

describe('normaliseFlight', () => {
  it('should normalise the response', () => {
    const result = normaliseTicket(S1.flights[0], 60 * 60 * 1000);
    expect(result).toMatchInlineSnapshot(`
APITicket {
  "bestBefore": 1970-01-01T01:00:00.123Z,
  "cacheTTLMs": 3600000,
  "flights": [
    APITicketFlight {
      "flightDuration": 115,
      "flightNumber": "144",
      "fromPlace": "Schonefeld",
      "fromTime": 2019-08-08T04:30:00.000Z,
      "id": "9708aa1e09",
      "toPlace": "Stansted",
      "toTime": 2019-08-08T06:25:00.000Z,
    },
    APITicketFlight {
      "flightDuration": 120,
      "flightNumber": "8542",
      "fromPlace": "Stansted",
      "fromTime": 2019-08-10T05:35:00.000Z,
      "id": "18120bb1d2",
      "toPlace": "Schonefeld",
      "toTime": 2019-08-10T07:35:00.000Z,
    },
  ],
  "id": "7bc756ad54",
  "price": APIMonetary {
    "amount": "129.00",
    "currency": "EUR",
  },
  "vendorId": "powerUs",
}
`);
  });
});
