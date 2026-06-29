import { RoleType } from '../../common/enums';

export interface RoleDto {
  id: string;
  name: string;
  type: RoleType;
  description: string;
  isCustom: boolean;
  inheritsFrom?: string[];
  usersCount: number;
  tenantId?: string;
}

export interface CreateRoleDto {
  name: string;
  type: RoleType;
  description?: string;
  isCustom?: boolean;
  inheritsFrom?: string[];
  tenantId?: string;
  permissionIds?: string[];
}

export type UpdateRoleDto = Partial<CreateRoleDto>;
