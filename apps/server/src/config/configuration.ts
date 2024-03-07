import { PowerUsConfig } from '../vendorPowerUs/powerus.types';
import { Vendor, VendorMergedMap, VendorsConfig } from './config.types';

// Just for illustration purposes
type TestConfig = Vendor<
  'testVnd',
  { testPropItem: string },
  { testPropDflt: number }
>;

export type ConcreteVensdorsCfgSrc = PowerUsConfig | TestConfig;
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
      timeoutMs: SEC,
    },
    powerUs: {
      cacheTTL: HOUR,
      refteshAfterMs: 55 * MIN,
      retryAttempts: 2,
      backoffMs: SEC,
      timeoutMs: 5 * SEC,
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
    // Just for illustration purposes
    // {
    //   vendorId: 'testVnd',
    //   testPropItem: 'some text',
    //   refteshAfterMs: 10 * SEC,
    // },
  ],
});
