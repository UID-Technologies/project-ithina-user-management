import { createApp } from './app';
import { connectDatabase } from './infrastructure/database/mongoose.connection';
import { ensureIndexes } from './infrastructure/database/indexes';
import { env } from './config/env.config';
import { logger } from './config/logger.config';

async function bootstrap() {
  await connectDatabase();
  await ensureIndexes();
  const app = createApp();

  app.listen(env.PORT, () => {
    logger.info(`User Management API listening on port ${env.PORT}`);
    logger.info(`Swagger docs: http://localhost:${env.PORT}/api/docs`);
  });
}

bootstrap().catch((err) => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});
