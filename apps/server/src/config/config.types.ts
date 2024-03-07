export interface WithVendorID<T extends string> {
  vendorId: T;
}

export interface SchedulerConfig {
  refteshAfterMs: number;
  timeout: number;
  retryAttempts?: number;
  retryBackoff?: number;
}

export interface Vendor<
  ID extends string,
  Item extends object,
  Dflt extends object = object,
> extends WithVendorID<ID> {
  rawDflt: Dflt;
  rawItem: Item;

  dfltItem: Dflt & SchedulerConfig;
  configItem: WithVendorID<ID> &
    Item &
    Partial<Dflt> &
    Partial<SchedulerConfig>;
  merged: WithVendorID<ID> & Dflt & Item & SchedulerConfig;
}

export type GenericVendor = Vendor<string, object>;

type DefaultsMap<Vens extends GenericVendor> = {
  [K in Vens['vendorId']]: Vens extends WithVendorID<K>
    ? Vens['dfltItem']
    : never;
};

export type VendorMergedMap<Vens extends GenericVendor> = {
  [K in Vens['vendorId']]: Vens extends WithVendorID<K>
    ? Vens['merged']
    : never;
};

export interface VendorsConfig<
  Vens extends GenericVendor,
  VendMap = DefaultsMap<Vens>,
> {
  vendors: VendMap;
  sources: Array<Vens['configItem']>;
}
