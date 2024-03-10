import { ApiProperty } from '@nestjs/swagger';
import { APIItem } from './api.lib';
import { Currency, CurrencyPrescisionMap } from './Currency';
import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';

type Monetary = {
  amount: string;
  currency: Currency;
};

// TODO: Use int / monetary types like dinero.js
const toMonetary = (
  price: number | Prisma.Decimal,
  currency: Currency,
): Monetary => ({
  amount: price.toFixed(CurrencyPrescisionMap[currency]),
  currency,
});

export class APIMonetary extends APIItem<Monetary> implements Monetary {
  static create = (price: number | Prisma.Decimal, currency: Currency) =>
    new APIMonetary(toMonetary(price, currency));

  @Expose()
  @ApiProperty({
    description:
      'Amount: a string representing a number with a dot as a decimal separator',
    type: String,
    example: '123.45',
  })
  amount = this._d.amount;

  @Expose()
  @ApiProperty({
    description: 'Currency: a string representing a currency code',
    type: String,
    enumName: 'Currency',
    enum: Object.keys(CurrencyPrescisionMap),
  })
  currency = this._d.currency;
}
