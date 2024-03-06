import { PowerusConfig } from '../powerus/powerus.types';
import { Vendor, VendorsConfig } from './config.types';

// export const getAppConfig = (): { port: number } => ({
//   port: parseInt(process.env.PORT ?? '', 10) ?? 3000,
// });

export const getVendorConfig = (): VendorsConfig<
  PowerusConfig | Vendor<'foo', { a: 1 }, { b: 'b' }>
> => ({
  vendors: {
    foo: {
      a: 1,
    },
    powerUs: {
      cacheTTL: 60 * 60 * 1000, // 1h
      fetchAttempts: 3,
      fetchBackoff: 2000,
      fetchTimeout: 1000,
    },
  },
  sources: [
    {
      vendorId: 'powerUs',
      url: 'https://coding-challenge.powerus.de/flight/source1',
    },
    {
      vendorId: 'powerUs',
      url: 'https://coding-challenge.powerus.de/flight/source2',
    },
  ],
});
