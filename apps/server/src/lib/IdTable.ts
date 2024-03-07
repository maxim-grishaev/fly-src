export interface IdTable<T, ID extends keyof any> {
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
    byId,
    ids: arr.map(getId),
  };
};

export const writeToIdTable = <T, ID extends keyof any>(
  table: IdTable<T, ID>,
  getId: (it: T) => ID,
  item: T,
) => {
  const id = getId(item);
  const hasItem = id in table.byId;
  if (!hasItem) {
    table.ids.push(id);
  }
  table.byId[id] = item;
};
