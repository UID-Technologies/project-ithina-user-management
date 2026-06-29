import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../../common/errors/app.errors';
import { parsePagination, buildMeta } from '../../shared/pagination/pagination.util';
import { writeAuditLog } from '../../common/utils/audit.util';
import { UserModel } from '../users/users.model';
import { roleRepository } from './roles.repository';
import { CreateRoleDto, RoleDto, UpdateRoleDto } from './roles.types';
import { RoleDocument } from './roles.model';

function toDto(doc: RoleDocument): RoleDto {
  return {
    id: doc.externalId,
    name: doc.name,
    type: doc.type,
    description: doc.description,
    isCustom: doc.isCustom,
    inheritsFrom: doc.inheritsFrom.length ? doc.inheritsFrom : undefined,
    usersCount: doc.usersCount,
    tenantId: doc.tenantId,
  };
}

export class RoleService {
  async list(query: { page?: number; limit?: number; type?: string; tenantId?: string }) {
    const { page, limit, skip } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.type) filter.type = query.type;
    if (query.tenantId) filter.tenantId = query.tenantId;
    const [items, total] = await Promise.all([
      roleRepository.findAll(filter, skip, limit),
      roleRepository.count(filter),
    ]);
    return { items: items.map(toDto), meta: buildMeta(page, limit, total) };
  }

  async getById(id: string): Promise<RoleDto> {
    const role = await roleRepository.findByExternalId(id);
    if (!role) throw new NotFoundError('Role');
    return toDto(role);
  }

  async create(input: CreateRoleDto, actor?: string): Promise<RoleDto> {
    const role = await roleRepository.create({
      externalId: `r-${uuidv4().slice(0, 8)}`,
      name: input.name,
      type: input.type,
      description: input.description ?? '',
      isCustom: input.isCustom ?? false,
      inheritsFrom: input.inheritsFrom ?? [],
      usersCount: 0,
      tenantId: input.tenantId,
      permissionIds: input.permissionIds ?? [],
    });
    await writeAuditLog({
      actor: actor ?? 'System',
      actorRole: 'Super Admin',
      tenant: 'Platform',
      action: 'Created role',
      resource: role.name,
      scope: 'Global',
      result: 'success',
    });
    return toDto(role);
  }

  async update(id: string, input: UpdateRoleDto, actor?: string): Promise<RoleDto> {
    const role = await roleRepository.updateByExternalId(id, input);
    if (!role) throw new NotFoundError('Role');
    await writeAuditLog({
      actor: actor ?? 'System',
      actorRole: 'Super Admin',
      tenant: 'Platform',
      action: 'Updated role',
      resource: role.name,
      scope: 'Global',
      result: 'success',
    });
    return toDto(role);
  }

  async remove(id: string, actor?: string): Promise<void> {
    const role = await roleRepository.findByExternalId(id);
    if (!role) throw new NotFoundError('Role');

    await UserModel.updateMany({ roleIds: id }, { $pull: { roleIds: id } });
    await roleRepository.deleteByExternalId(id);

    await writeAuditLog({
      actor: actor ?? 'System',
      actorRole: 'Super Admin',
      tenant: 'Platform',
      action: 'Deleted role',
      resource: role.name,
      scope: 'Global',
      result: 'success',
    });
  }
}

export const roleService = new RoleService();
