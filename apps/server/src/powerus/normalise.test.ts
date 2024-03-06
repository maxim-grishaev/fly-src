import { S1 } from './fixture.mock';
import { normaliseFlight } from './normalise';

describe('normalise', () => {
  it('should normalise the path', () => {
    const result = normaliseFlight(
      S1.flights[0].slices[0],
      S1.flights[0].price,
    );
    expect(result).toMatchInlineSnapshot(`
{
  "arrivalTime": 2019-08-08T06:25:00.000Z,
  "departureTime": 2019-08-08T04:30:00.000Z,
  "duration": 115,
  "flightNumber": "144",
  "fromPlace": "Schonefeld",
  "id": "60520ba10eb4c22b",
  "price": {
    "currency": "EUR",
    "price": "129.00",
  },
  "source": "powerus",
  "toPlace": "Stansted",
}
`);
  });
});
