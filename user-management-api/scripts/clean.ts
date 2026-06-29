/**
 * Remove all application data from MongoDB (collections only; database is kept).
 *
 * Usage:
 *   npm run clean
 *   npm run db:clean
 *   npm run clean -- --force     # required when NODE_ENV=production
 */
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../src/infrastructure/database/mongoose.connection';
import { clearAllData } from '../src/seed/clear-data';
import { env } from '../src/config/env.config';
import { logger } from '../src/config/logger.config';

async function main(): Promise<void> {
  const force = process.argv.includes('--force');

  if (env.NODE_ENV === 'production' && !force) {
    logger.error(
      'Refusing to clean data in production. Re-run with --force if you are certain.',
    );
    process.exit(1);
  }

  await connectDatabase();
  logger.info('Cleaning all application collections…');
  await clearAllData();
  logger.info('Clean completed — database is empty and ready for a fresh seed.');
}

main()
  .catch((err) => {
    logger.error({ err }, 'Clean failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
    await mongoose.connection.close();
  });
