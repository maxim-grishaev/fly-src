import * as crypto from 'crypto';

export const createId = (data: string): string =>
  crypto.createHash('sha1').update(data).digest('hex').substring(0, 10);
