import { Schema, model, Document } from 'mongoose';
import { ModuleKey, TenantStatus, TenantTier } from '../../common/enums';

export interface TenantDocument extends Document {
  externalId: string;
  name: string;
  tier: TenantTier;
  industry: string;
  country: string;
  storesCount: number;
  usersCount: number;
  status: TenantStatus;
  modules: ModuleKey[];
  primaryContact: string;
  contactEmail: string;
  monthlyRevenue: number;
  createdAt: Date;
}

const tenantSchema = new Schema<TenantDocument>(
  {
    externalId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tier: { type: String, required: true },
    industry: { type: String, required: true },
    country: { type: String, required: true },
    storesCount: { type: Number, default: 0 },
    usersCount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'suspended', 'trial'], default: 'active' },
    modules: [{ type: String }],
    primaryContact: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    monthlyRevenue: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const TenantModel = model<TenantDocument>('Tenant', tenantSchema);
