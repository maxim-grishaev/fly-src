import { PowerusConfig } from '../powerus/powerus.types';
import { Vendor, VendorMergedMap, VendorsConfig } from './config.types';

// TODO: remove this
type TestConfig = Vendor<
  'testVnd',
  { testPropItem: string },
  { testPropDflt: number }
>;

export type ConcreteVensdorsCfgSrc = PowerusConfig | TestConfig;
export type ConcreteVensdorId = ConcreteVensdorsCfgSrc['vendorId'];
export type ConcreteVensdorConfig = {
  [K in ConcreteVensdorId]: VendorMergedMap<ConcreteVensdorsCfgSrc>[K];
}[ConcreteVensdorId];

const SEC = 1000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;

export const getVendorConfig = (): VendorsConfig<ConcreteVensdorsCfgSrc> => ({
  vendors: {
    testVnd: {
      testPropDflt: 1,
      refteshAfterMs: 10 * SEC,
      retryAttempts: 0,
      timeout: SEC,
    },
    powerUs: {
      cacheTTL: HOUR,
      refteshAfterMs: 55 * MIN,
      retryAttempts: 2,
      retryBackoff: SEC,
      timeout: 5 * SEC,
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
    {
      vendorId: 'testVnd',
      testPropItem: 'some text',
    },
  ],
});
