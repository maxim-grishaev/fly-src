export type Currency = 'EUR' | 'USD' | 'GBP';

export const CurrencyPrescMap: Record<Currency, number> = {
  EUR: 2,
  USD: 2,
  GBP: 2,
};

export type Monetary = {
  amount: string;
  currency: Currency;
};

// TODO: Use int / monetary types like dinero.js
export const toMonetary = (price: number, currency: Currency): Monetary => ({
  amount: price.toFixed(CurrencyPrescMap[currency]),
  currency,
});
