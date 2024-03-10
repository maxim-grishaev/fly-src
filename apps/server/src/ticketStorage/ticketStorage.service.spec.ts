import { Test, TestingModule } from '@nestjs/testing';
import { TicketStorageService } from './ticketStorage.service';
import { mockDateNow } from '../lib/mockDateNow';
import { APITicket } from '../model/APITicket';
import { APIMonetary } from '../model/APIMonetary';

const mockNow = mockDateNow(1);
const createTicket = (id: string, validUntil: number) =>
  APITicket.create({
    id,
    price: APIMonetary.create(100, 'EUR'),
    cacheTTLMs: 0,
    staleAfter: new Date(validUntil),
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
    await service.writeMany([createTicket('1', 10), createTicket('2', 10)]);
    const flights = await service.readAllValid();
    expect(flights).toHaveLength(2);
  });

  it('should remove outdated flights', async () => {
    mockNow.mockReturnValue(1000);
    await service.writeMany([createTicket('1', 10), createTicket('2', 2000)]);
    const flights = await service.readAllValid();
    expect(flights).toHaveLength(1);
  });
});
