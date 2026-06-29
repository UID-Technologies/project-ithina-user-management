import { Schema, model, Document } from 'mongoose';
import { UserStatus } from '../../common/enums';

export interface UserDocument extends Document {
  externalId: string;
  name: string;
  email: string;
  avatar?: string;
  tenantId: string | 'platform';
  roleIds: string[];
  locationIds: string[];
  status: UserStatus;
  lastActive: string;
  mfaEnabled: boolean;
}

const userSchema = new Schema<UserDocument>(
  {
    externalId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    avatar: { type: String },
    tenantId: { type: String, required: true, index: true },
    roleIds: [{ type: String }],
    locationIds: [{ type: String }],
    status: { type: String, enum: ['active', 'invited', 'suspended'], default: 'active' },
    lastActive: { type: String, default: '—' },
    mfaEnabled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const UserModel = model<UserDocument>('User', userSchema);
