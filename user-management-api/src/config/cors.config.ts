import { CorsOptions } from 'cors';
import { env } from './env.config';

export const corsConfig: CorsOptions = {
  origin: env.CORS_ORIGIN,
  credentials: true,
};
