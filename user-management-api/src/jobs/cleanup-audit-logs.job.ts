import { logger } from '../config/logger.config';
import { AuditLogModel } from '../modules/audit/audit.model';

const RETENTION_DAYS = 365;

export async function cleanupAuditLogsJob(): Promise<void> {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const result = await AuditLogModel.deleteMany({ timestamp: { $lt: cutoff } });
  logger.info({ deleted: result.deletedCount }, 'Audit log cleanup job completed');
}
