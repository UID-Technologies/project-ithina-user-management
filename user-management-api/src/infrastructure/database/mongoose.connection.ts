import mongoose from 'mongoose';
import { databaseConfig } from '../../config/database.config';
import { logger } from '../../config/logger.config';

export async function connectDatabase(): Promise<void> {
  mongoose.set('strictQuery', databaseConfig.options.strictQuery);

  const maxAttempts = 15;
  const delayMs = 2000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await mongoose.connect(databaseConfig.uri);
      logger.info('Connected to MongoDB');
      return;
    } catch (err) {
      if (attempt === maxAttempts) {
        logger.error({ err }, 'MongoDB connection failed after retries');
        throw err;
      }
      logger.warn({ err, attempt, maxAttempts }, 'MongoDB not ready — retrying');
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('Disconnected from MongoDB');
}
