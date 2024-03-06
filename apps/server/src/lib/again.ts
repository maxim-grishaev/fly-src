import { wait } from './wait';

const ATTEMPT_STEP = 1;
const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_RETRIES = 2;
const DEFAULT_BACKOFF_MS = 100;

export const calcBackoff = (attempt: number, backoff: number) =>
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  attempt === 1 ? 0 : backoff * Math.pow(2, attempt - 2);

export function again<T>(
  cb: () => Promise<T>,
  {
    timeout = DEFAULT_TIMEOUT_MS,
    retries = DEFAULT_RETRIES,
    backoff = DEFAULT_BACKOFF_MS,
  }: {
    timeout?: number;
    retries?: number;
    backoff?: number;
  } = {},
) {
  const wrappedCb = (attempt: number) =>
    wait(calcBackoff(attempt, backoff)).then(() =>
      Promise.race([
        cb(),
        wait(timeout).then(() => {
          throw new Error(`Attempt ${attempt} took longer than ${timeout}ms`);
        }),
      ]),
    );

  const loop = (attempt: number): Promise<T> =>
    wrappedCb(attempt).catch(error => {
      if (attempt - ATTEMPT_STEP >= retries) {
        throw error;
      }
      return loop(attempt + ATTEMPT_STEP);
    });

  return loop(ATTEMPT_STEP);
}
