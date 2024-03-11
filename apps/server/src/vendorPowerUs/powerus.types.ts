export interface PowerUsRespError {
  statusCode: number;
  message: string;
}

export interface PowerUsRespSlice {
  origin_name: string;
  destination_name: string;
  departure_date_time_utc: string;
  arrival_date_time_utc: string;
  flight_number: string;
  duration: number;
}

export interface PowerUsRespFlight {
  slices: PowerUsRespSlice[];
  price: number;
}

export interface PowerUsResp {
  flights: PowerUsRespFlight[];
}
