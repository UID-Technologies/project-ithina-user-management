import { Schema, model, Document } from 'mongoose';
import { ModuleKey, PermissionAction, PermissionScope } from '../../common/enums';

export interface PermissionDocument extends Document {
  externalId: string;
  module: ModuleKey;
  resource: string;
  action: PermissionAction;
  scope: PermissionScope;
}

const permissionSchema = new Schema<PermissionDocument>(
  {
    externalId: { type: String, required: true, unique: true },
    module: { type: String, required: true },
    resource: { type: String, required: true },
    action: { type: String, required: true },
    scope: { type: String, required: true },
  },
  { timestamps: true },
);

export const PermissionModel = model<PermissionDocument>('Permission', permissionSchema);
