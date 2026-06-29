import { logger } from '../../config/logger.config';
import { TenantModel } from '../../modules/tenants/tenants.model';
import { UserModel } from '../../modules/users/users.model';
import { AuditLogModel } from '../../modules/audit/audit.model';
import { GuardrailEventModel } from '../../modules/guardrails/guardrails.model';

export async function ensureIndexes(): Promise<void> {
  await Promise.all([
    TenantModel.syncIndexes(),
    UserModel.syncIndexes(),
    AuditLogModel.syncIndexes(),
    GuardrailEventModel.syncIndexes(),
  ]);
  logger.info('Database indexes synchronized');
}
