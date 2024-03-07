import { Vendor, VendorsConfig } from './config.types';

type V1 = Vendor<
  'vend 1',
  { item1: 'v1 item 1'; item2: 'v1 item 2' },
  { def1: 'v1 def 1'; def2: 'v1 def 2' }
>;
type V2 = Vendor<
  'vend 2',
  { v2_item1: 'v2 item 1'; v2_item2: 'v2 item 2' },
  { v2_def1: 'v2 def 1'; v2_def2: 'v2 def 2' }
>;

export type _Vens = VendorsConfig<V1 | V2>;
export const xxx: _Vens = {
  vendors: {
    'vend 1': {
      def1: 'v1 def 1',
      def2: 'v1 def 2',
      refteshAfterMs: 5000,
      timeoutMs: 1000,
    },
    'vend 2': {
      v2_def1: 'v2 def 1',
      v2_def2: 'v2 def 2',
      refteshAfterMs: 5000,
      timeoutMs: 1000,
    },
  },
  sources: [
    {
      vendorId: 'vend 1',
      def1: 'v1 def 1',
      item2: 'v1 item 2',
      item1: 'v1 item 1',
    },
    {
      vendorId: 'vend 2',
      v2_def1: 'v2 def 1',
      v2_item2: 'v2 item 2',
      v2_item1: 'v2 item 1',
      // @ts-expect-error wrong param!
      def1: 'v1 def 1',
    },
  ],
};
