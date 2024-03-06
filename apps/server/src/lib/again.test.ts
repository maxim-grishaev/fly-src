import { again, calcBackoff } from './again';
import * as waitModule from './wait';

const waitSpy = jest.spyOn(waitModule, 'wait');

describe('calcBackoff', () => {
  it.each<[number, number, number]>([
    [1, 100, 0],
    [2, 100, 100],
    [3, 100, 200],
    [4, 100, 400],
  ])(
    'should calculate the right backoff on attempt %d, backoff %d - %d',
    (attempt, backoff, result) =>
      expect(calcBackoff(attempt, backoff)).toEqual(result),
  );
});

describe('again', () => {
  describe('rejection', () => {
    const retries = 2;
    const timeout = 100;
    const backoff = 100;
    const cb = jest.fn();
    const error = new Error('oops');
    const value = true;

    afterEach(cb.mockReset);

    it('should retry the specified number of times if rejecting, before failing', () => {
      cb.mockRejectedValue(error);
      expect.assertions(2);

      return again(cb, { retries, timeout, backoff }).catch(rejection => {
        expect(rejection).toEqual(error);
        expect(cb).toHaveBeenCalledTimes(retries + 1);
      });
    });

    it('should return as soon as successful', () => {
      cb.mockRejectedValueOnce(error);
      cb.mockResolvedValueOnce(value);
      expect.assertions(2);

      return again(cb, { retries, timeout, backoff }).then(result => {
        expect(cb).toHaveBeenCalledTimes(2);
        expect(result).toEqual(value);
      });
    });
  });

  describe('timeout', () => {
    const retries = 2;
    const timeout = 100;
    const backoff = 100;
    const cb = jest.fn();
    const expectedTimeoutError = new Error(
      `Attempt ${retries + 1} took longer than ${timeout}ms`,
    );
    const value = true;

    afterEach(cb.mockReset);

    it('should return timeout error', () => {
      cb.mockImplementation(() => waitModule.wait(timeout * 10));
      expect.assertions(2);

      return again(cb, { timeout, retries: 0 }).catch(error => {
        expect(error).toEqual(
          new Error(`Attempt 1 took longer than ${timeout}ms`),
        );
        expect(cb).toHaveBeenCalledTimes(1);
      });
    });

    it('should retry the specified number of times if timing out, before failing', () => {
      cb.mockImplementation(() => waitModule.wait(timeout * 10));
      expect.assertions(2);

      return again(cb, { timeout, retries, backoff }).catch(rejection => {
        expect(rejection).toEqual(expectedTimeoutError);
        expect(cb).toHaveBeenCalledTimes(retries + 1);
      });
    });

    it('should return as soon as successful', () => {
      cb.mockResolvedValueOnce(waitModule.wait(timeout * 2));
      cb.mockResolvedValueOnce(value);
      expect.assertions(2);

      return again(cb, { timeout, retries, backoff }).then(result => {
        expect(cb).toHaveBeenCalledTimes(2);
        expect(result).toEqual(value);
      });
    });
  });

  describe('backoff', () => {
    const retries = 2;
    const timeout = 100;
    const backoff = 100;
    const cb = jest.fn();
    const expectedTimeoutError = new Error(
      `Attempt ${retries + 1} took longer than ${timeout}ms`,
    );
    const value = true;

    afterEach(cb.mockReset);

    it('should retry the specified number of times if timing out, before failing, backing off appropriately', () => {
      cb.mockImplementation(() => waitModule.wait(timeout * 10));
      expect.assertions(4);

      return again(cb, { timeout, retries, backoff }).catch(rejection => {
        expect(waitSpy).toHaveBeenCalledWith(calcBackoff(1, backoff));
        expect(waitSpy).toHaveBeenCalledWith(calcBackoff(2, backoff));
        expect(rejection).toEqual(expectedTimeoutError);
        expect(cb).toHaveBeenCalledTimes(retries + 1);
      });
    });

    it('should return as soon as successful', () => {
      cb.mockResolvedValueOnce(waitModule.wait(timeout * 2));
      cb.mockResolvedValueOnce(value);
      expect.assertions(3);

      return again(cb, { timeout, retries, backoff }).then(result => {
        expect(waitSpy).toHaveBeenCalledWith(calcBackoff(1, backoff));
        expect(cb).toHaveBeenCalledTimes(2);
        expect(result).toEqual(value);
      });
    });
  });
});
