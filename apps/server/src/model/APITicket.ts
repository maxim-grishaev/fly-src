import { ApiProperty } from '@nestjs/swagger';
import { APIItem } from './api.lib';
import { ApiDateProp, ApiIdProp } from './api.decorators';
import { Prisma } from '@prisma/client';
import { APIMonetary } from './APIMonetary';
import { APITicketFlight } from './APITicketFlight';
import { toCurrency } from './Currency';
import { Exclude } from 'class-transformer';

interface Ticket<V extends string = string> {
  vendorId: V;
  id: string;
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
      id: tp.id,
      vendorId: tp.vendorId,
      price: APIMonetary.create(tp.priceAmout, toCurrency(tp.priceCurrency)),
      cacheTTLMs: tp.cacheTTLMs,
      bestBefore: tp.bestBefore,
      flights: tfps.map(APITicketFlight.fromPrisma),
    });

  static create = <T extends Ticket<string>>(t: T) => new APITicket(t);

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
  id = this._d.id;

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
