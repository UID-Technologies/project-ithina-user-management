/**
 * Seed demo data into MongoDB (clears existing app data first).
 *
 * Usage:
 *   npm run seed
 *   npm run db:seed
 */
import mongoose from 'mongoose';
import { runSeed } from '../src/seed/seed';
import { disconnectDatabase } from '../src/infrastructure/database/mongoose.connection';
import { logger } from '../src/config/logger.config';

runSeed()
  .catch((err) => {
    logger.error({ err }, 'Seed failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
    await mongoose.connection.close();
  });
