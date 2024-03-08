import { Ticket, TicketFlight } from '../model/ticket.type';
import { createId } from '../lib/createId';
import { toMonetary } from '../lib/toMonetary';
import {
  PowerUsResp,
  PowerUsRespFlight,
  PowerUsRespSlice,
} from './powerus.types';

const getSliceIdData = (s: PowerUsRespSlice) => [
  s.flight_number,
  s.departure_date_time_utc,
  s.origin_name,
  s.destination_name,
];

export const createTicketFlightId = (s: PowerUsRespSlice): string =>
  createId(getSliceIdData(s).join('\n'));

export const createTicketId = (data: PowerUsRespFlight): string => {
  const allIdData = data.slices.flatMap(getSliceIdData).join('\n');
  return createId(allIdData);
};

export const normaliseTicketFlight = (
  slice: PowerUsRespSlice,
): TicketFlight => ({
  id: createTicketFlightId(slice),
  fromPlace: slice.origin_name,
  fromTime: slice.departure_date_time_utc,
  toPlace: slice.destination_name,
  toTime: slice.arrival_date_time_utc,
  flightDuration: slice.duration,
  flightNumber: slice.flight_number,
});

export const normaliseTicket = (
  ticket: PowerUsRespFlight,
  cacheTTL: number,
): Ticket => ({
  vendorId: 'powerUs',
  id: createTicketId(ticket),
  price: toMonetary(ticket.price, 'EUR'),
  flights: ticket.slices.map(normaliseTicketFlight),
  staleAfter: new Date(Date.now() + cacheTTL).toISOString(),
  cacheTTLMs: cacheTTL,
});

export const normaliseFlightResponse = (
  data: PowerUsResp,
  cacheTTL: number,
): Ticket[] => data.flights.flatMap(item => normaliseTicket(item, cacheTTL));
