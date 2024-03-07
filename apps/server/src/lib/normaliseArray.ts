export interface NormalArray<T, ID extends keyof any> {
  byId: Record<ID, T>;
  ids: ID[];
}

export const getId = <ID extends string | number>(item: { id: ID }) => item.id;

export const normaliseArray = <T, ID extends keyof any>(
  arr: T[],
  getId: (item: T) => ID,
): NormalArray<T, ID> => {
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
