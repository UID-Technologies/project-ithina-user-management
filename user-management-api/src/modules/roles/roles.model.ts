import { Schema, model, Document } from 'mongoose';
import { RoleType } from '../../common/enums';

export interface RoleDocument extends Document {
  externalId: string;
  name: string;
  type: RoleType;
  description: string;
  isCustom: boolean;
  inheritsFrom: string[];
  usersCount: number;
  tenantId?: string;
  permissionIds: string[];
}

const roleSchema = new Schema<RoleDocument>(
  {
    externalId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['Platform', 'Tenant'], required: true },
    description: { type: String, default: '' },
    isCustom: { type: Boolean, default: false },
    inheritsFrom: [{ type: String }],
    usersCount: { type: Number, default: 0 },
    tenantId: { type: String },
    permissionIds: [{ type: String }],
  },
  { timestamps: true },
);

export const RoleModel = model<RoleDocument>('Role', roleSchema);
