import { ApiProperty } from '@nestjs/swagger';
import { Ticket, TicketFlight } from './ticket.type';
import { CurrencyPrescMap, Monetary } from '../lib/toMonetary';
import { APIItem } from './api.lib';
import { ApiDateProp, ApiIdProp } from './api.decorators';

export class APIMonerary extends APIItem<Monetary> {
  static create = (m: Monetary) => new APIMonerary(m);

  @ApiProperty({
    description:
      'Amount: a string representing a number with a dot as a decimal separator',
    type: String,
    example: '123.45',
  })
  amount = this._d.amount;

  @ApiProperty({
    description: 'Currency: a string representing a currency code',
    type: String,
    enumName: 'Currency',
    enum: Object.keys(CurrencyPrescMap),
  })
  currency = this._d.currency;
}

export class APITicketFlight extends APIItem<TicketFlight> {
  static create = (t: TicketFlight) => new APITicketFlight(t);

  @ApiIdProp('A ticket flight ID')
  id = this._d.id;

  @ApiProperty({
    description: 'Departure place',
    type: String,
    example: 'London',
  })
  fromPlace = this._d.fromPlace;

  @ApiDateProp('Departure time')
  fromTime = this._d.fromTime;

  @ApiProperty({
    description: 'Arrival place',
    type: String,
    example: 'Paris',
  })
  toPlace = this._d.toPlace;

  @ApiDateProp('Arrival time')
  toTime = this._d.toTime;

  @ApiProperty({
    description: 'Flight duration in minutes',
    type: Number,
    example: 120,
  })
  flightDuration = this._d.flightDuration;

  @ApiProperty({
    description: 'Flight number',
    type: String,
    example: '123',
  })
  flightNumber = this._d.flightNumber;
}

export class APITicket<Tkt extends Ticket<string>> extends APIItem<Tkt> {
  static create = <T extends Ticket<string>>(t: T) => new APITicket<T>(t);

  @ApiIdProp('A ticket ID')
  id = this._d.id;

  @ApiProperty({
    description: 'Price',
    type: APIMonerary,
  })
  price = new APIMonerary(this._d.price);

  @ApiDateProp('The date until the ticket data is still valid')
  staleAfter = this._d.staleAfter;

  @ApiProperty({
    description: 'A list of flights in the ticket',
    type: [APITicketFlight],
  })
  flights = this._d.flights.map(APITicketFlight.create);

  // Assume we want to hide the vendor from API
  // @ApiProperty({
  //   description: 'Vendor ID',
  //   type: String,
  //   enumName: 'VendorId',
  //   enum: Object.keys(VendorIdPrescMap),
  // })
  // vendorId = this._d.vendorId;
}
