import { AuditLogModel, AuditLogDocument } from './audit.model';

export class AuditRepository {
  findAll(filter: Record<string, unknown>, skip: number, limit: number) {
    return AuditLogModel.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit);
  }

  count(filter: Record<string, unknown>) {
    return AuditLogModel.countDocuments(filter);
  }

  findRecent(limit: number) {
    return AuditLogModel.find().sort({ timestamp: -1 }).limit(limit);
  }
}

export const auditRepository = new AuditRepository();

export type { AuditLogDocument };
