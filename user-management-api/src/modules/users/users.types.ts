import { UserStatus } from '../../common/enums';

export interface UserDto {
  id: string;
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

export interface CreateUserDto {
  name: string;
  email: string;
  tenantId: string | 'platform';
  roleIds?: string[];
  locationIds?: string[];
  status?: UserStatus;
  mfaEnabled?: boolean;
}

export type UpdateUserDto = Partial<CreateUserDto>;
