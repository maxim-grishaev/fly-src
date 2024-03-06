import { PowerusConfig } from './powerus/powerus.types';
import { VendorsConfig } from './config/config.types';

export const VENDORS: VendorsConfig<PowerusConfig> = {
  vendors: {
    powerus: {
      cacheTTL: 60 * 60 * 1000, // 1h
      fetchAttempts: 3,
      fetchBackoff: 2000,
      fetchTimeout: 1000,
    },
  },
  sources: [
    {
      vendorId: 'powerus',
      url: 'https://coding-challenge.powerus.de/flight/source1',
    },
    {
      vendorId: 'powerus',
      url: 'https://coding-challenge.powerus.de/flight/source2',
    },
  ],
};
