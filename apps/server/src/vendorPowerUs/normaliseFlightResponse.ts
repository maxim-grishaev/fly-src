import { createId } from '../lib/createId';
import {
  PowerUsResp,
  PowerUsRespFlight,
  PowerUsRespSlice,
} from './powerus.types';
import { APITicket } from '../model/APITicket';
import { APIMonetary } from '../model/APIMonetary';
import { APITicketFlight } from '../model/APITicketFlight';

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

export const normaliseTicketFlight = (slice: PowerUsRespSlice) =>
  APITicketFlight.create({
    id: createTicketFlightId(slice),
    fromPlace: slice.origin_name,
    fromTime: new Date(slice.departure_date_time_utc),
    toPlace: slice.destination_name,
    toTime: new Date(slice.arrival_date_time_utc),
    flightDuration: slice.duration,
    flightNumber: slice.flight_number,
  });

export const normaliseTicket = (ticket: PowerUsRespFlight, cacheTTL: number) =>
  APITicket.create({
    vendorId: 'powerUs',
    id: createTicketId(ticket),
    price: APIMonetary.create(ticket.price, 'EUR'),
    flights: ticket.slices.map(normaliseTicketFlight),
    staleAfter: new Date(Date.now() + cacheTTL),
    cacheTTLMs: cacheTTL,
  });

export const normaliseFlightResponse = (data: PowerUsResp, cacheTTL: number) =>
  data.flights.flatMap(item => normaliseTicket(item, cacheTTL));
