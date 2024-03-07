import { Ticket, TicketFlight } from '../flight/flight.type';
import { createId } from '../lib/createId';
import { toMonetary } from '../lib/toMonetary';
import {
  PowerusResp,
  PowerusRespFlight,
  PowerusRespSlice,
} from './powerus.types';

const getSliceIdData = (s: PowerusRespSlice) => [
  s.flight_number,
  s.departure_date_time_utc,
  s.origin_name,
  s.destination_name,
];

export const createTicketFlightId = (s: PowerusRespSlice): string =>
  createId(getSliceIdData(s).join('\n'));

export const createTicketId = (data: PowerusRespFlight): string => {
  const allIdData = data.slices.flatMap(getSliceIdData).join('\n');
  return createId(allIdData);
};

export const normaliseTicketFlight = (
  slice: PowerusRespSlice,
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
  ticket: PowerusRespFlight,
  cacheTTL: number,
): Ticket => {
  return {
    vendorId: 'powerUs',
    id: createTicketId(ticket),
    price: toMonetary(ticket.price, 'EUR'),
    items: ticket.slices.map(normaliseTicketFlight),
    validUntil: new Date(Date.now() + cacheTTL).toISOString(),
    cacheTTL,
  };
};

export const normaliseFlightResponse = (
  data: PowerusResp,
  cacheTTL: number,
): Ticket[] => data.flights.flatMap(item => normaliseTicket(item, cacheTTL));
