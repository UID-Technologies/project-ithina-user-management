import { Schema, model, Document } from 'mongoose';

export interface PlatformMetricsDocument extends Document {
  key: string;
  platformUsers: number;
  storesUnderManagement: number;
  mrr: number;
  pendingApprovals: number;
  guardrailsFired24h: number;
  guardrailEscalations24h: number;
  customRoles: number;
  modulesDeployed: number;
  countriesCount: number;
}

const platformMetricsSchema = new Schema<PlatformMetricsDocument>(
  {
    key: { type: String, required: true, unique: true },
    platformUsers: { type: Number, required: true },
    storesUnderManagement: { type: Number, required: true },
    mrr: { type: Number, required: true },
    pendingApprovals: { type: Number, required: true },
    guardrailsFired24h: { type: Number, required: true },
    guardrailEscalations24h: { type: Number, default: 3 },
    customRoles: { type: Number, required: true },
    modulesDeployed: { type: Number, required: true },
    countriesCount: { type: Number, default: 9 },
  },
  { timestamps: true },
);

export const PlatformMetricsModel = model<PlatformMetricsDocument>(
  'PlatformMetrics',
  platformMetricsSchema,
);
