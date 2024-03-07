import { PowerUsResp } from './powerus.types';

export const isPowerusResp = (data: unknown): data is PowerUsResp =>
  data !== null &&
  typeof data === 'object' &&
  'flights' in data &&
  Array.isArray(data.flights);

export const fetchSource = async (url: string) =>
  await fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText} ${url}`);
      }
      return res.json();
    })
    .then(json => {
      if (!isPowerusResp(json)) {
        throw new Error(`Invalid JSON from ${url}`);
      }
      return json;
    });
