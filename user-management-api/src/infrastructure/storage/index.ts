/** Object storage placeholder — swap for S3 / Azure Blob when needed */
export const storage = {
  async upload(_key: string, _data: Buffer): Promise<string> {
    return _key;
  },
  async get(_key: string): Promise<Buffer | null> {
    return null;
  },
};
