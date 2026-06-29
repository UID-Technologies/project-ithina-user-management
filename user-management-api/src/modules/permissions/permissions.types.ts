import { ModuleKey, PermissionAction, PermissionScope } from '../../common/enums';

export interface PermissionDto {
  id: string;
  module: ModuleKey;
  resource: string;
  action: PermissionAction;
  scope: PermissionScope;
}

export interface RolePermissionMapDto {
  roleId: string;
  permissionIds: string[];
}
