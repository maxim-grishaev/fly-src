import { Ticket } from './ticket.type';

export const MOCK_TICKET_1: Ticket = {
  id: 't_1',
  vendorId: 'foo',
  flights: [
    {
      id: 'f_1',
      fromPlace: 'A',
      fromTime: new Date(100).toISOString(),
      toPlace: 'B',
      toTime: new Date(200).toISOString(),
      flightDuration: 100,
      flightNumber: 'X1',
    },
  ],
  cacheTTLMs: 200,
  staleAfter: new Date(500).toISOString(),
  price: { currency: 'EUR', amount: '10.00' },
};

export const MOCK_TICKET_2: Ticket = {
  id: '2',
  vendorId: 'bar',
  flights: [
    {
      id: 'f_2',
      fromPlace: 'B',
      fromTime: new Date(200).toISOString(),
      toPlace: 'A',
      toTime: new Date(100).toISOString(),
      flightDuration: 100,
      flightNumber: 'X2',
    },
  ],
  cacheTTLMs: 200,
  staleAfter: new Date(500).toISOString(),
  price: { currency: 'EUR', amount: '10.00' },
};