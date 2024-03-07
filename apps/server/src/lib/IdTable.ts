export interface IdTable<T, ID extends keyof any> {
  getId: (item: T) => ID;
  byId: Record<ID, T>;
  ids: ID[];
}

export const getId = <ID extends string | number>(item: { id: ID }) => item.id;

export const createIdTableByArray = <T, ID extends keyof any>(
  arr: T[],
  getId: (item: T) => ID,
): IdTable<T, ID> => {
  const ids = new Array<ID>(arr.length);
  const byId = arr.reduce(
    (acc, item, idx) => {
      const id = getId(item);
      ids[idx] = id;
      acc[id] = item;
      return acc;
    },
    {} as Record<ID, T>,
  );

  return {
    getId,
    byId,
    ids: arr.map(getId),
  };
};

export const writeToIdTable = <T, ID extends keyof any>(
  table: IdTable<T, ID>,
  item: T,
) => {
  const id = table.getId(item);
  const hasItem = id in table.byId;
  if (!hasItem) {
    table.ids.push(id);
  }
  table.byId[id] = item;
};

export const selectFromIdTable = <T, ID extends keyof any>(
  table: IdTable<T, ID>,
  filter: (it: T) => boolean,
) => table.ids.map(id => table.byId[id]).filter(filter);
