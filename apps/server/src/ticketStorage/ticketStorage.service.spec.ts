import { Test, TestingModule } from '@nestjs/testing';
import { TicketStorageService } from './ticketStorage.service';
import { mockDateNow } from '../lib/mockDateNow';
import { Currency } from '../model/Currency';
import { PrismaService } from './prisma.service';
import { Prisma, PrismaClient } from '@prisma/client';

const MockTicketTable = {
  findMany: jest.fn(),
  findUnique: jest.fn(),
  upsert: jest.fn(),
} satisfies Partial<PrismaClient['ticket']>;

const MockTicketFlightTable = {
  findMany: jest.fn(),
  findUnique: jest.fn(),
  upsert: jest.fn(),
} satisfies Partial<PrismaClient['ticketFlight']>;

const MockPrismaService = {
  $connect: jest.fn(),
  $transaction: jest.fn(),
  // @ts-expect-error not a real thing
  ticket: MockTicketTable,
  // @ts-expect-error not a real thing
  ticketFlight: MockTicketFlightTable,
} satisfies Partial<PrismaService>;

const mockNow = mockDateNow(1);

const createTicket = (
  id: string,
  bestBefore: number,
): Prisma.TicketCreateInput & {
  flights: Prisma.TicketFlightCreateInput[];
} => {
  return {
    id,
    priceAmout: new Prisma.Decimal(100),
    priceCurrency: Currency.Eur,
    cacheTTLMs: 0,
    bestBefore: new Date(bestBefore),
    flights: [],
    // @ts-expect-error not a real thing
    vendor: null,
  };
};

describe('TicketStorageService', () => {
  let service: TicketStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketStorageService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(MockPrismaService)
      .compile();

    service = module.get(TicketStorageService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all valid flights', async () => {
    MockTicketTable.findMany.mockResolvedValue([
      createTicket('1', 10),
      createTicket('2', 10),
    ]);
    const flights = await service.readAllValid();
    expect(flights).toHaveLength(2);
  });

  it('should remove outdated flights', async () => {
    MockTicketTable.findMany.mockResolvedValue([
      createTicket('1', 10), // should expire
      createTicket('2', 2000),
    ]);
    mockNow.mockReturnValue(1000);

    await service.readAllValid();

    expect(MockTicketTable.findMany).toHaveBeenCalledWith({
      where: { bestBefore: { gt: new Date(Date.now()) } },
      include: { flights: true },
    });
    // Handled by the db query
    // const flights = await service.readAllValid();
    // expect(flights).toHaveLength(1);
  });
});
