export const assertUnreachable = (x: never, msg: string): never => {
  throw new Error(`Invariant: ${msg} ${x}`);
};
