import { Schema, model, Document } from 'mongoose';
import { AuditResult, PermissionScope } from '../../common/enums';

export interface AuditLogDocument extends Document {
  externalId: string;
  timestamp: Date;
  actor: string;
  actorRole: string;
  tenant: string;
  action: string;
  resource: string;
  scope: PermissionScope;
  result: AuditResult;
  ip: string;
}

const auditLogSchema = new Schema<AuditLogDocument>(
  {
    externalId: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now, index: true },
    actor: { type: String, required: true },
    actorRole: { type: String, required: true },
    tenant: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    scope: { type: String, required: true },
    result: { type: String, enum: ['success', 'denied', 'pending'], required: true },
    ip: { type: String, default: '127.0.0.1' },
  },
  { timestamps: true },
);

export const AuditLogModel = model<AuditLogDocument>('AuditLog', auditLogSchema);
