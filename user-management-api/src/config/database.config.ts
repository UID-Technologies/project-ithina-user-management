import { env } from './env.config';

export const databaseConfig = {
  uri: env.MONGODB_URI,
  options: {
    strictQuery: true,
  },
};
