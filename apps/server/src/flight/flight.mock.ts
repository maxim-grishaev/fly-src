import { Flight } from './flight.type';

export const MOCK_FLIGHT_1: Flight = {
  id: '1',
  vendorId: 'foo',
  validUntil: new Date(500),
  departureTime: new Date(100),
  arrivalTime: new Date(200),
  cacheTTL: 1000,
  flightDuration: 100,
  flightNumber: 'X1',
  fromPlace: 'A',
  toPlace: 'B',
  price: { currency: 'EUR', price: '10.00' },
};

export const MOCK_FLIGHT_2: Flight = {
  id: '2',
  vendorId: 'bar',
  validUntil: new Date(500),
  departureTime: new Date(100),
  arrivalTime: new Date(200),
  cacheTTL: 1000,
  flightDuration: 100,
  flightNumber: 'X2',
  fromPlace: 'A',
  toPlace: 'B',
  price: { currency: 'EUR', price: '10.00' },
};
