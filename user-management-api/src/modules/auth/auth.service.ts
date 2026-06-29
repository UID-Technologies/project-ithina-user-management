import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.config';
import { UnauthorizedError } from '../../common/errors/app.errors';
import { userRepository } from '../users/users.repository';
import { roleRepository } from '../roles/roles.repository';
import { permissionRepository } from '../permissions/permissions.repository';
import { tenantRepository } from '../tenants/tenants.repository';
import { authRepository } from './auth.repository';
import { AuthProfileDto, AuthTokenDto, LoginDto } from './auth.types';
import type { UserDocument } from '../users/users.model';

export class AuthService {  async buildProfile(user: UserDocument): Promise<AuthProfileDto> {
    const primaryRoleId = user.roleIds[0];
    const [roles, tenant] = await Promise.all([
      roleRepository.findByExternalIds(user.roleIds),
      user.tenantId === 'platform'
        ? null
        : tenantRepository.findByExternalId(user.tenantId),
    ]);
    const primaryRole = roles.find((r) => r.externalId === primaryRoleId);

    return {
      id: user.externalId,
      email: user.email,
      name: user.name,
      roleIds: user.roleIds,
      tenantId: user.tenantId,
      locationIds: user.locationIds ?? [],
      primaryRoleName: primaryRole?.name ?? 'User',
      tenantName:
        user.tenantId === 'platform' ? 'Ithina Platform' : (tenant?.name ?? user.tenantId),
    };
  }

  async login(input: LoginDto): Promise<AuthTokenDto> {
    const account = await authRepository.findByEmail(input.email);
    if (!account || !(await account.comparePassword(input.password))) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const user = await userRepository.findByExternalId(account.userId);
    if (!user) {
      throw new UnauthorizedError('User account not found');
    }

    const profile = await this.buildProfile(user);
    const permissions = await this.resolvePermissions(user.roleIds);
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        roleIds: user.roleIds,
        tenantId: user.tenantId,
        permissions,
      },
      env.JWT_SECRET,
      { subject: user.externalId, expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
    );

    return {
      accessToken: token,
      expiresIn: env.JWT_EXPIRES_IN,
      user: profile,
    };
  }

  async getProfileByUserId(userId: string): Promise<AuthProfileDto> {
    const user = await userRepository.findByExternalId(userId);
    if (!user) {
      throw new UnauthorizedError('User account not found');
    }
    return this.buildProfile(user);
  }

  async resolvePermissions(roleIds: string[]): Promise<string[]> {
    const roles = await roleRepository.findByExternalIds(roleIds);
    const permissionIds = new Set<string>();
    for (const role of roles) {
      role.permissionIds.forEach((id) => permissionIds.add(id));
    }
    const permissions = await permissionRepository.findByExternalIds([...permissionIds]);
    return permissions.map((p) => p.externalId);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
}

export const authService = new AuthService();
