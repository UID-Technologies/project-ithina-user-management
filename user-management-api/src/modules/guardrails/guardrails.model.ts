import { Schema, model, Document } from 'mongoose';
import { GuardrailStatus, ModuleKey } from '../../common/enums';

export interface GuardrailRuleDocument extends Document {
  externalId: string;
  name: string;
  module: ModuleKey;
  trigger: string;
  approvers: string[];
  escalateAfterHours: number;
  overrideRoleId: string;
  status: GuardrailStatus;
}

export interface GuardrailEventDocument extends Document {
  externalId: string;
  guardrailId: string;
  guardrailName: string;
  tenantId: string;
  tenantName: string;
  module: ModuleKey;
  trigger: string;
  result: 'fired' | 'escalated' | 'blocked';
  firedAt: Date;
}

const guardrailRuleSchema = new Schema<GuardrailRuleDocument>(
  {
    externalId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    module: { type: String, required: true },
    trigger: { type: String, required: true },
    approvers: [{ type: String }],
    escalateAfterHours: { type: Number, default: 24 },
    overrideRoleId: { type: String, required: true },
    status: { type: String, enum: ['active', 'draft'], default: 'active' },
  },
  { timestamps: true },
);

const guardrailEventSchema = new Schema<GuardrailEventDocument>(
  {
    externalId: { type: String, required: true, unique: true },
    guardrailId: { type: String, required: true, index: true },
    guardrailName: { type: String, required: true },
    tenantId: { type: String, required: true },
    tenantName: { type: String, required: true },
    module: { type: String, required: true },
    trigger: { type: String, required: true },
    result: { type: String, enum: ['fired', 'escalated', 'blocked'], default: 'fired' },
    firedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

export const GuardrailRuleModel = model<GuardrailRuleDocument>('GuardrailRule', guardrailRuleSchema);
export const GuardrailEventModel = model<GuardrailEventDocument>('GuardrailEvent', guardrailEventSchema);
