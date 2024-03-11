import {
  PowerUsResp,
  PowerUsRespFlight,
  PowerUsRespSlice,
} from './powerus.types';
import { APITicket } from '../model/APITicket';
import { APIMonetary } from '../model/APIMonetary';
import { APITicketFlight } from '../model/APITicketFlight';
import { MAIN_CURRENCY } from '../model/Currency';

export const normaliseTicketFlight = (slice: PowerUsRespSlice) =>
  APITicketFlight.create({
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
    price: APIMonetary.create(ticket.price, MAIN_CURRENCY),
    flights: ticket.slices.map(normaliseTicketFlight),
    bestBefore: new Date(Date.now() + cacheTTL),
    cacheTTLMs: cacheTTL,
  });

export const normaliseFlightResponse = (data: PowerUsResp, cacheTTL: number) =>
  data.flights.flatMap(item => normaliseTicket(item, cacheTTL));
