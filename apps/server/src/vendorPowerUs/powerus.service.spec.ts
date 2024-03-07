import { Test, TestingModule } from '@nestjs/testing';
import { PowerusService } from './powerus.service';
import * as pfs from './fetchSource';

jest.spyOn(pfs, 'fetchSource').mockResolvedValue({ flights: [] });

const nowOrig = Date.now;
const mockNow = jest.fn().mockReturnValue(123);
Date.now = mockNow;
afterAll(() => {
  Date.now = nowOrig;
});

describe(PowerusService.name, () => {
  let service: PowerusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [PowerusService],
    }).compile();

    service = module.get(PowerusService);
  });

  it('should fetch OK', async () => {
    await expect(service.fetchSource('abc', 123)).resolves.toEqual([]);
  });

  it('should fetch OK', async () => {
    jest.spyOn(pfs, 'fetchSource').mockResolvedValueOnce({
      flights: [
        {
          slices: [
            {
              origin_name: 'origin_name',
              destination_name: 'destination_name',
              departure_date_time_utc: '2021-01-01T00:00:00Z',
              arrival_date_time_utc: '2021-01-01T00:00:00Z',
              flight_number: 'flight_number',
              duration: 123,
            },
            {
              origin_name: 'destination_name',
              destination_name: 'origin_name',
              departure_date_time_utc: '2021-02-01T00:00:00Z',
              arrival_date_time_utc: '2021-02-01T00:00:00Z',
              flight_number: 'flight_number',
              duration: 123,
            },
          ],
          price: 123,
        },
      ],
    });
    await expect(service.fetchSource('abc', 333)).resolves.
toMatchInlineSnapshot(`
[
  {
    "cacheTTL": 333,
    "flights": [
      {
        "flightDuration": 123,
        "flightNumber": "flight_number",
        "fromPlace": "origin_name",
        "fromTime": "2021-01-01T00:00:00Z",
        "id": "776302d17f",
        "toPlace": "destination_name",
        "toTime": "2021-01-01T00:00:00Z",
      },
      {
        "flightDuration": 123,
        "flightNumber": "flight_number",
        "fromPlace": "destination_name",
        "fromTime": "2021-02-01T00:00:00Z",
        "id": "a9fd2cb531",
        "toPlace": "origin_name",
        "toTime": "2021-02-01T00:00:00Z",
      },
    ],
    "id": "cbc7dd2f0e",
    "price": {
      "amount": "123.00",
      "currency": "EUR",
    },
    "validUntil": "1970-01-01T00:00:00.456Z",
    "vendorId": "powerUs",
  },
]
`);
  });
});
