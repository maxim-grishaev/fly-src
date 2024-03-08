export const getId = <ID extends keyof any, T extends { id: ID }>(item: T) => {
  if (!item) {
    console.error(new Error('getId: item is null'));
    debugger;
  }
  return item.id;
};

interface IdTablePlain<T, ID extends keyof any> {
  byId: Record<ID, T>;
  ids: ID[];
}

export const createIdTableByArray = <T, ID extends keyof any>(
  arr: T[],
  getId: (item: T) => ID,
) => {
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

export const writeToIdTable = async <T, ID extends keyof any>(
  table: IdTablePlain<T, ID>,
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

export const selectFromIdTable = <T, ID extends keyof any>(
  table: IdTablePlain<T, ID>,
  filter: (it: T) => boolean,
) => table.ids.map(id => table.byId[id]).filter(filter);
