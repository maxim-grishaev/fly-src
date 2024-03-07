import { Test, TestingModule } from '@nestjs/testing';
import { TicketStorageService } from './ticketStorage.service';
import { mockDateNow } from '../lib/mockDateNow';
import { Ticket } from '../flight/flight.type';

const mockNow = mockDateNow(1);
const createTicket = (id: string, validUntil: number): Ticket => ({
  id,
  price: {
    amount: '100',
    currency: 'EUR',
  },
  cacheTTL: 0,
  validUntil: new Date(validUntil).toISOString(),
  flights: [],
  vendorId: 'test',
});

describe('TicketStorageService', () => {
  let service: TicketStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketStorageService],
    }).compile();

    service = module.get(TicketStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all valid flights', async () => {
    await service.writeManyFlights([
      createTicket('1', 10),
      createTicket('2', 10),
    ]);
    const flights = await service.readAllValidFlights();
    expect(flights).toHaveLength(2);
  });

  it('should remove outdated flights', async () => {
    mockNow.mockReturnValue(1000);
    await service.writeManyFlights([
      createTicket('1', 10),
      createTicket('2', 2000),
    ]);
    const flights = await service.readAllValidFlights();
    expect(flights).toHaveLength(1);
  });
});
