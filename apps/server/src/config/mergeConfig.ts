import { GenericVendor, VendorsConfig } from './config.types';

/**
 * Merges config into plain array if items. Handles TS magic
 * @param config Raw config
 * @returns
 */
export const mergeConfig = <T extends GenericVendor>(
  config: VendorsConfig<T>,
): Array<T['merged']> =>
  config.sources.map(src => {
    const id = src.vendorId as T['vendorId'];
    return {
      ...config.vendors[id],
      ...src,
    };
  });
