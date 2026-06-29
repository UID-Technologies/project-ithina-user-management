import { Schema, model, Document } from 'mongoose';
import { ApprovalStatus, ModuleKey } from '../../common/enums';

export interface ApprovalDocument extends Document {
  externalId: string;
  tenantId: string;
  tenantName: string;
  guardrailId: string;
  guardrailName: string;
  module: ModuleKey;
  resource: string;
  requestedBy: string;
  status: ApprovalStatus;
  requestedAt: Date;
}

const approvalSchema = new Schema<ApprovalDocument>(
  {
    externalId: { type: String, required: true, unique: true },
    tenantId: { type: String, required: true, index: true },
    tenantName: { type: String, required: true },
    guardrailId: { type: String, required: true },
    guardrailName: { type: String, required: true },
    module: { type: String, required: true },
    resource: { type: String, required: true },
    requestedBy: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'escalated'], default: 'pending' },
    requestedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const ApprovalModel = model<ApprovalDocument>('Approval', approvalSchema);
