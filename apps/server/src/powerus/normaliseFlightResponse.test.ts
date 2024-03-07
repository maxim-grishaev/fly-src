import { S1 } from './fixture.mock';
import {
  normaliseFlight,
  normaliseFlightResponse,
} from './normaliseFlightResponse';

describe('normaliseResponse', () => {
  it('should normalise response', () => {
    const result = normaliseFlightResponse(S1, 60 * 60 * 1000);
    expect(
      result.map(flight => [
        flight.departureTime,
        flight.fromPlace,
        flight.toPlace,
      ]),
    ).toEqual([
      [new Date('2019-08-08T04:30:00.000Z'), 'Schonefeld', 'Stansted'],
      [new Date('2019-08-10T05:35:00.000Z'), 'Stansted', 'Schonefeld'],
      [new Date('2019-08-08T20:25:00.000Z'), 'Schonefeld', 'Stansted'],
      [new Date('2019-08-10T06:50:00.000Z'), 'Stansted', 'Schonefeld'],
      [new Date('2019-08-08T20:25:00.000Z'), 'Schonefeld', 'Stansted'],
      [new Date('2019-08-10T05:35:00.000Z'), 'Stansted', 'Schonefeld'],
      [new Date('2019-08-08T16:00:00.000Z'), 'Schonefeld', 'Stansted'],
      [new Date('2019-08-10T06:50:00.000Z'), 'Stansted', 'Schonefeld'],
      [new Date('2019-08-08T08:00:00.000Z'), 'Schonefeld', 'Stansted'],
      [new Date('2019-08-10T06:50:00.000Z'), 'Stansted', 'Schonefeld'],
    ]);
  });
});

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
    expect(result).toEqual({
      arrivalTime: new Date('2019-08-08T06:25:00.000Z'),
      cacheTTL: 3600000,
      departureTime: new Date('2019-08-08T04:30:00.000Z'),
      flightDuration: 115,
      flightNumber: '144',
      fromPlace: 'Schonefeld',
      id: '9708aa1e09',
      price: {
        currency: 'EUR',
        price: '129.00',
      },
      vendorId: 'powerUs',
      toPlace: 'Stansted',
      validUntil: new Date('1970-01-01T01:00:00.123Z'),
    });
  });
});
