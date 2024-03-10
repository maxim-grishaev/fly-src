export type Currency = 'XXX' | 'EUR' | 'USD' | 'GBP';

export const CurrencyPrescMap: Record<Currency, number> = {
  XXX: 2,
  EUR: 2,
  USD: 2,
  GBP: 2,
};

export const toCurrency = (str: string): Currency => {
  if (str in CurrencyPrescMap) {
    return str as Currency;
  }
  // throw new Error(`Invalid currency: ${str}`);
  return 'XXX';
};
