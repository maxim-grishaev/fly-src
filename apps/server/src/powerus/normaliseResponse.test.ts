import { S1 } from './fixture.mock';
import { normaliseFlightResponse } from './normaliseResponse';

describe('normaliseResponse', () => {
  it('should normalise response', () => {
    const result = normaliseFlightResponse(S1, 60 * 60 * 1000);
    expect(
  result.map((flight) => [flight.id, flight.fromPlace, flight.toPlace])
).toMatchInlineSnapshot(`
[
  [
    "9708aa1e09",
    "Schonefeld",
    "Stansted",
  ],
  [
    "18120bb1d2",
    "Stansted",
    "Schonefeld",
  ],
  [
    "8b6f9c5add",
    "Schonefeld",
    "Stansted",
  ],
  [
    "aba024a07e",
    "Stansted",
    "Schonefeld",
  ],
  [
    "8b6f9c5add",
    "Schonefeld",
    "Stansted",
  ],
  [
    "18120bb1d2",
    "Stansted",
    "Schonefeld",
  ],
  [
    "550a52736c",
    "Schonefeld",
    "Stansted",
  ],
  [
    "aba024a07e",
    "Stansted",
    "Schonefeld",
  ],
  [
    "04bb7ca48a",
    "Schonefeld",
    "Stansted",
  ],
  [
    "aba024a07e",
    "Stansted",
    "Schonefeld",
  ],
]
`);
  });
});
