import { PowerusConfig } from '../powerus/powerus.types';
import { Vendor, VendorMergedMap, VendorsConfig } from './config.types';

// TODO: remove this
type TestConfig = Vendor<'testVnd', { testPropItem: 'b' }, { testPropDflt: 1 }>;

// type CfgOrig = ReturnType<typeof getVendorConfig>;
// export type ConcreteVensdorsSrc = CfgOrig extends VendorsConfig<infer U> ? U : never;

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
      cacheTTL: HOUR,
      retryAttempts: 0,
      refteshOverlapMs: 5 * MIN,
      timeout: SEC,
    },
    powerUs: {
      cacheTTL: HOUR,
      refteshOverlapMs: 5 * MIN,
      retryAttempts: 2,
      retryBackoff: SEC / 2,
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
  ],
});
