import { connectDatabase, disconnectDatabase } from '../src/infrastructure/database/mongoose.connection';
import { ensureIndexes } from '../src/infrastructure/database/indexes';
import { logger } from '../src/config/logger.config';

async function main() {
  await connectDatabase();
  await ensureIndexes();
  await disconnectDatabase();
  logger.info('Indexes created successfully');
}

main().catch((err) => {
  logger.error({ err }, 'Index creation failed');
  process.exit(1);
});
