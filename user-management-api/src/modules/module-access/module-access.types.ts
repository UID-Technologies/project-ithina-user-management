import { ModuleKey } from '../../common/enums';

export interface ModuleDto {
  key: ModuleKey;
  name: string;
  description: string;
  color: string;
}

export interface TenantModuleAccessDto {
  tenantId: string;
  enabledModules: ModuleKey[];
}

export interface PatchModuleAccessDto {
  enabledModules: ModuleKey[];
}
