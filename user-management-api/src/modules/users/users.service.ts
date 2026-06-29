import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../../common/errors/app.errors';
import { parsePagination, buildMeta } from '../../shared/pagination/pagination.util';
import { writeAuditLog } from '../../common/utils/audit.util';
import { userRepository } from './users.repository';
import { CreateUserDto, UserDto, UpdateUserDto } from './users.types';
import { UserDocument } from './users.model';

function toDto(doc: UserDocument): UserDto {
  return {
    id: doc.externalId,
    name: doc.name,
    email: doc.email,
    avatar: doc.avatar,
    tenantId: doc.tenantId,
    roleIds: doc.roleIds,
    locationIds: doc.locationIds,
    status: doc.status,
    lastActive: doc.lastActive,
    mfaEnabled: doc.mfaEnabled,
  };
}

export class UserService {
  async list(query: {
    page?: number;
    limit?: number;
    tenantId?: string;
    status?: string;
    search?: string;
  }) {
    const { page, limit, skip } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.tenantId) filter.tenantId = query.tenantId;
    if (query.status) filter.status = query.status;
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }
    const [items, total] = await Promise.all([
      userRepository.findAll(filter, skip, limit),
      userRepository.count(filter),
    ]);
    return { items: items.map(toDto), meta: buildMeta(page, limit, total) };
  }

  async getById(id: string): Promise<UserDto> {
    const user = await userRepository.findByExternalId(id);
    if (!user) throw new NotFoundError('User');
    return toDto(user);
  }

  async create(input: CreateUserDto, actor?: string): Promise<UserDto> {
    const user = await userRepository.create({
      externalId: `u-${uuidv4().slice(0, 8)}`,
      name: input.name,
      email: input.email,
      tenantId: input.tenantId,
      roleIds: input.roleIds ?? [],
      locationIds: input.locationIds ?? [],
      status: input.status ?? 'active',
      lastActive: 'Just now',
      mfaEnabled: input.mfaEnabled ?? false,
    });
    await writeAuditLog({
      actor: actor ?? 'System',
      actorRole: 'Super Admin',
      tenant: input.tenantId === 'platform' ? 'Platform' : input.tenantId,
      action: 'Created user',
      resource: user.email,
      scope: 'Tenant',
      result: 'success',
    });
    return toDto(user);
  }

  async update(id: string, input: UpdateUserDto, actor?: string): Promise<UserDto> {
    const user = await userRepository.updateByExternalId(id, input);
    if (!user) throw new NotFoundError('User');
    await writeAuditLog({
      actor: actor ?? 'System',
      actorRole: 'Super Admin',
      tenant: user.tenantId === 'platform' ? 'Platform' : user.tenantId,
      action: 'Updated user',
      resource: user.email,
      scope: 'Tenant',
      result: 'success',
    });
    return toDto(user);
  }

  async remove(id: string, actor?: string): Promise<void> {
    const user = await userRepository.deleteByExternalId(id);
    if (!user) throw new NotFoundError('User');
    await writeAuditLog({
      actor: actor ?? 'System',
      actorRole: 'Super Admin',
      tenant: 'Platform',
      action: 'Deleted user',
      resource: user.email,
      scope: 'Global',
      result: 'success',
    });
  }
}

export const userService = new UserService();
