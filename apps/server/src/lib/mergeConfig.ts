import {
  GenericVendor,
  VendorsConfig,
  AllVendorsConfigMerged,
} from '../config/config.types';

/**
 * Merges config into plain array if items. Handles TS magic
 * @param config Raw config
 * @returns
 */
export const mergeConfig = <T extends GenericVendor>(
  config: VendorsConfig<T>,
) =>
  config.sources.reduce((acc, src) => {
    const id = src.vendorId as T['vendorId'];
    const merged = {
      ...config.vendors[id],
      ...src,
    } as AllVendorsConfigMerged<T>[typeof id];
    acc[id] = merged;
    return acc;
  }, {} as AllVendorsConfigMerged<T>);
