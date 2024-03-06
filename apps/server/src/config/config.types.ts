export interface WithVendorID<T extends string> {
  vendorId: T;
}

export interface Vendor<
  ID extends string,
  Dflt extends object,
  Item extends object,
> extends WithVendorID<ID> {
  rawDflt: Dflt;
  rawItem: Item;
  configItem: WithVendorID<ID> & Item & Partial<Dflt>;
  merged: WithVendorID<ID> & Dflt & Item;
}

export type GenericVendor = Vendor<string, object, object>;

type DefaultsMap<Vens extends GenericVendor> = {
  [K in Vens['vendorId']]: Vens extends WithVendorID<K>
    ? Vens['rawDflt']
    : never;
};

export interface VendorsConfig<
  Vens extends GenericVendor,
  VendMap = DefaultsMap<Vens>,
> {
  vendors: VendMap;
  sources: Array<Vens['configItem']>;
}

export type AllVendorsConfigMerged<Vens extends GenericVendor> = {
  [K in Vens['vendorId']]: Vens extends WithVendorID<K>
    ? Vens['merged']
    : never;
};
