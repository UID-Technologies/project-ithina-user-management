import { Schema, model, Document } from 'mongoose';
import { ModuleKey } from '../../common/enums';

export interface ModuleCatalogDocument extends Document {
  key: ModuleKey;
  name: string;
  description: string;
  color: string;
}

export interface TenantModuleAccessDocument extends Document {
  tenantId: string;
  enabledModules: ModuleKey[];
}

const moduleCatalogSchema = new Schema<ModuleCatalogDocument>(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true },
);

const tenantModuleAccessSchema = new Schema<TenantModuleAccessDocument>(
  {
    tenantId: { type: String, required: true, unique: true },
    enabledModules: [{ type: String }],
  },
  { timestamps: true },
);

export const ModuleCatalogModel = model<ModuleCatalogDocument>('ModuleCatalog', moduleCatalogSchema);
export const TenantModuleAccessModel = model<TenantModuleAccessDocument>(
  'TenantModuleAccess',
  tenantModuleAccessSchema,
);
