import { v4 as uuidv4 } from 'uuid';
import { AuditLogModel } from '../../modules/audit/audit.model';

export interface AuditEntryInput {
  actor: string;
  actorRole: string;
  tenant: string;
  action: string;
  resource: string;
  scope: string;
  result: 'success' | 'denied' | 'pending';
  ip?: string;
}

export async function writeAuditLog(entry: AuditEntryInput): Promise<void> {
  await AuditLogModel.create({
    externalId: `a-${uuidv4().slice(0, 8)}`,
    ...entry,
    timestamp: new Date(),
    ip: entry.ip ?? '127.0.0.1',
  });
}
