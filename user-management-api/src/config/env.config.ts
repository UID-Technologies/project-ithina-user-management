import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3002),
  /** Browser-reachable API base URL (Swagger server list, docs links). */
  API_PUBLIC_URL: z.string().url().optional(),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('8h'),
  CORS_ORIGIN: z.string().default('http://localhost:8080'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  SEED_ADMIN_EMAIL: z.string().email().default('anjali@ithina.ai'),
  SEED_ADMIN_PASSWORD: z.string().min(8).default('SuperAdmin123!'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const data = parsed.data;

export const env = {
  ...data,
  API_PUBLIC_URL: data.API_PUBLIC_URL ?? `http://localhost:${data.PORT}`,
};
