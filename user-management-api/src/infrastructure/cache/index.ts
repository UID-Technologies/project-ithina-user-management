/** In-memory cache placeholder — swap for Redis when scaling */
export const cache = {
  get<T>(_key: string): T | null {
    return null;
  },
  set(_key: string, _value: unknown, _ttlSeconds?: number): void {},
  del(_key: string): void {},
};
