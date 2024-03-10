import { APIMonetary } from './APIMonetary';
import { APITicket } from './APITicket';
import { APITicketFlight } from './APITicketFlight';

export const MOCK_TICKET_1 = APITicket.create({
  id: 't_1',
  vendorId: 'foo',
  flights: [
    APITicketFlight.create({
      id: 'f_1',
      fromPlace: 'A',
      fromTime: new Date(100),
      toPlace: 'B',
      toTime: new Date(200),
      flightDuration: 100,
      flightNumber: 'X1',
    }),
  ],
  cacheTTLMs: 200,
  staleAfter: new Date(500),
  price: APIMonetary.create(10, 'EUR'),
});

export const MOCK_TICKET_2 = APITicket.create({
  id: '2',
  vendorId: 'bar',
  flights: [
    APITicketFlight.create({
      id: 'f_2',
      fromPlace: 'B',
      fromTime: new Date(200),
      toPlace: 'A',
      toTime: new Date(100),
      flightDuration: 100,
      flightNumber: 'X2',
    }),
  ],
  cacheTTLMs: 200,
  staleAfter: new Date(500),
  price: APIMonetary.create(20, 'EUR'),
});
