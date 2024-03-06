import { S1 } from './fixture.mock';
import { normaliseFlight } from './normaliseFlight';

const nowOrig = Date.now;
Date.now = () => 123;
afterAll(() => {
  Date.now = nowOrig;
});

describe('normaliseFlight', () => {
  it('should normalise the response', () => {
    const result = normaliseFlight(
      S1.flights[0].slices[0],
      S1.flights[0].price,
      60 * 60 * 1000,
    );
    expect(result).toMatchInlineSnapshot(`
{
  "arrivalTime": 2019-08-08T06:25:00.000Z,
  "cacheTTL": 3600000,
  "departureTime": 2019-08-08T04:30:00.000Z,
  "flightDuration": 115,
  "flightNumber": "144",
  "fromPlace": "Schonefeld",
  "id": "9708aa1e09",
  "price": {
    "currency": "EUR",
    "price": "129.00",
  },
  "source": "powerUs",
  "toPlace": "Stansted",
  "validUntil": 1970-01-01T01:00:00.123Z,
}
`);
  });
});
