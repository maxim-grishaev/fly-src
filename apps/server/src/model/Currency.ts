export enum Currency {
  Eur = 'EUR',
  Gbp = 'GBP',
  Usd = 'USD',
}
export const MAIN_CURRENCY = Currency.Eur;

export const CurrencyPrescisionMap: Record<Currency, number> = {
  EUR: 2,
  USD: 2,
  GBP: 2,
};

export const toCurrency = (str: string): Currency => {
  if (str in CurrencyPrescisionMap) {
    return str as Currency;
  }
  throw new Error(`Invalid currency: ${str}`);
};
