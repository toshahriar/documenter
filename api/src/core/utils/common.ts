import { createHash, randomBytes } from 'crypto';
import { unflatten } from 'flat';

export const generateToken = (salt?: string | number): string => {
  const timestamp = Date.now().toString();
  const randomStr = randomBytes(32).toString('hex');
  const baseString = `${salt ? `${salt}-` : ''}${timestamp}-${randomStr}`;
  return createHash('sha256').update(baseString).digest('hex');
};

export const omitProperties = <T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> => {
  const entries = Object.entries(obj).filter(([key]) => !keys.includes(key as K));
  return Object.fromEntries(entries) as Omit<T, K>;
};

export const parseRequestBody = (input: Record<string, any>): Record<string, any> => {
  const transformedKeys = Object.keys(input).reduce(
    (acc, key) => {
      const newKey = key.replace(/\[(\d+)]/g, '.$1');
      acc[newKey] = input[key];
      return acc;
    },
    {} as Record<string, any>
  );
  return unflatten(transformedKeys);
};
