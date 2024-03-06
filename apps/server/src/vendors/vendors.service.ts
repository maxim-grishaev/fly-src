import { Injectable } from '@nestjs/common';
import { mergeConfig } from '../lib/mergeConfig';
import { getVendorConfig } from '../config/configuration';
import { VendorMergedMap, VendorsConfig } from '../config/config.types';

type CfgOrig = ReturnType<typeof getVendorConfig>;
type Vens = CfgOrig extends VendorsConfig<infer U> ? U : never;
type VndId = Vens['vendorId'];

@Injectable()
export class VendorsService {
  private cfg = mergeConfig(getVendorConfig());

  getByVendorId<ID extends VndId>(id: ID) {
    return this.cfg.filter(c => c.vendorId === id) as unknown as Array<
      VendorMergedMap<Vens>[ID]
    >;
  }
}
