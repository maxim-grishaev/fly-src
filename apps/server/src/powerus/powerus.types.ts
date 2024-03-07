import { Vendor } from '../config/config.types';

export interface PowerusRespError {
  statusCode: number;
  message: string;
}

export interface PowerusRespSlice {
  origin_name: string;
  destination_name: string;
  departure_date_time_utc: string;
  arrival_date_time_utc: string;
  flight_number: string;
  duration: number;
}

export interface PowerusRespFlight {
  slices: PowerusRespSlice[];
  price: number;
}

export interface PowerusResp {
  flights: PowerusRespFlight[];
}

interface PowerusConfigSource {
  url: string;
}

export type PowerusConfig = Vendor<'powerUs', PowerusConfigSource>;
