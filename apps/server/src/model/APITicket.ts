import { ApiProperty } from '@nestjs/swagger';
import { APIItem } from './api.lib';
import { ApiDateProp, ApiIdProp } from './api.decorators';
import { Prisma, TicketFlight } from '@prisma/client';
import { APIMonetary } from './APIMonetary';
import { APITicketFlight, getSliceIdData } from './APITicketFlight';
import { toCurrency } from './Currency';
import { Exclude } from 'class-transformer';
import { createId } from '../lib/createId';

export const createTicketId = (
  tkt: Ticket<string>,
  flights: TicketFlight[],
): string => {
  const allIdData = flights
    .flatMap(getSliceIdData)
    .concat(tkt.vendorId)
    .join('\n');
  return createId(allIdData);
};

interface Ticket<V extends string = string> {
  vendorId: V;
  price: APIMonetary;
  flights: APITicketFlight[];
  // Not necessary, but assuming cache can have different values
  // depending on the source + easier to investigate
  cacheTTLMs: number;
  // Used to filter out stale data
  bestBefore: Date;
}

export class APITicket<V extends string = string>
  extends APIItem<Ticket<V>>
  implements Ticket<V>
{
  static fromPrisma = (
    tp: Prisma.$TicketPayload['scalars'],
    tfps: Array<Prisma.$TicketFlightPayload['scalars']>,
  ) =>
    APITicket.create({
      vendorId: tp.vendorId,
      price: APIMonetary.create(tp.priceAmout, toCurrency(tp.priceCurrency)),
      cacheTTLMs: tp.cacheTTLMs,
      bestBefore: tp.bestBefore,
      flights: tfps.map(APITicketFlight.fromPrisma),
    });

  static create = <V extends string>(t: Ticket<V>) => {
    // Noticed that the slices are not sorted by time
    // If not sorted, there may be unstable ID generation
    t.flights.sort((a, b) => a.fromTime.getTime() - b.fromTime.getTime());
    return new APITicket(t);
  };

  toCreateInput(): Prisma.TicketCreateInput {
    return {
      id: this.id,
      priceAmout: this.price.amount,
      priceCurrency: this.price.currency,
      bestBefore: this.bestBefore,
      cacheTTLMs: this.cacheTTLMs,
      vendor: { connect: { id: this.vendorId } },
      flights: { connect: this.flights.map(f => ({ id: f.id })) },
    };
  }

  @ApiIdProp('A ticket ID')
  id = createTicketId(this._d, this._d.flights);

  @ApiProperty({
    description: 'Price',
    type: APIMonetary,
  })
  price = new APIMonetary(this._d.price);

  @ApiDateProp('The date until the ticket data is still valid')
  bestBefore = this._d.bestBefore;

  @ApiProperty({
    description: 'A list of flights in the ticket',
    type: [APITicketFlight],
  })
  flights = this._d.flights.map(APITicketFlight.create);

  // Assume we want to hide these
  @Exclude()
  vendorId = this._d.vendorId;
  @Exclude()
  cacheTTLMs = this._d.cacheTTLMs;
}
