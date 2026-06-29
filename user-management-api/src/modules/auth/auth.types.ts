export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthProfileDto {
  id: string;
  email: string;
  name: string;
  roleIds: string[];
  tenantId: string | 'platform';
  locationIds: string[];
  primaryRoleName: string;
  tenantName: string;
}

export interface AuthTokenDto {
  accessToken: string;
  expiresIn: string;
  user: AuthProfileDto;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}
