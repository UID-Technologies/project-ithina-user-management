import { parsePagination, buildMeta } from '../../shared/pagination/pagination.util';
import { roleRepository } from '../roles/roles.repository';
import { permissionRepository } from './permissions.repository';
import { PermissionDto } from './permissions.types';
import { PermissionDocument } from './permissions.model';

function toDto(doc: PermissionDocument): PermissionDto {
  return {
    id: doc.externalId,
    module: doc.module,
    resource: doc.resource,
    action: doc.action,
    scope: doc.scope,
  };
}

export class PermissionService {
  async list(query: { page?: number; limit?: number; module?: string }) {
    const { page, limit, skip } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.module) filter.module = query.module;
    const [items, total] = await Promise.all([
      permissionRepository.findAll(filter, skip, limit),
      permissionRepository.count(filter),
    ]);
    return { items: items.map(toDto), meta: buildMeta(page, limit, total) };
  }

  async getRolePermissionMap(): Promise<Record<string, string[]>> {
    const roles = await roleRepository.findAll({}, 0, 1000);
    return Object.fromEntries(roles.map((r) => [r.externalId, r.permissionIds]));
  }

  /** @deprecated use getRolePermissionMap — kept for internal use */
  async getRolePermissionMapList() {
    const roles = await roleRepository.findAll({}, 0, 1000);
    return roles.map((r) => ({
      roleId: r.externalId,
      permissionIds: r.permissionIds,
    }));
  }
}

export const permissionService = new PermissionService();
