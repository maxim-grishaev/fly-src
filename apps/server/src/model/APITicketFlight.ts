import { ApiProperty } from '@nestjs/swagger';
import { ApiDateProp, ApiIdProp } from './api.decorators';
import { APIItem } from './api.lib';
import { Prisma } from '@prisma/client';
import { createId } from '../lib/createId';

interface TicketFlight {
  fromPlace: string;
  fromTime: Date;
  toPlace: string;
  toTime: Date;
  flightDuration: number;
  flightNumber: string;
}

export const getSliceIdData = (s: TicketFlight) =>
  [s.flightNumber, s.fromTime.toISOString(), s.fromPlace, s.toPlace].join('\n');

export class APITicketFlight
  extends APIItem<TicketFlight>
  implements TicketFlight
{
  static fromPrisma = (t: Prisma.$TicketFlightPayload['scalars']) =>
    new APITicketFlight(t);
  static create = (t: TicketFlight) => new APITicketFlight(t);

  toCreateInput(): Prisma.TicketFlightCreateInput {
    return {
      id: this.id,
      fromPlace: this.fromPlace,
      fromTime: this.fromTime,
      toPlace: this.toPlace,
      toTime: this.toTime,
      flightDuration: this.flightDuration,
      flightNumber: this.flightNumber,
    };
  }

  @ApiIdProp('A ticket flight ID')
  id = createId(getSliceIdData(this._d));

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
