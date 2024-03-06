export const wait = (ms: number): Promise<void> =>
  ms === 0 // set timeout with 0 does not mean immediate invocation
    ? Promise.resolve()
    : new Promise((resolve) => setTimeout(resolve, ms));
