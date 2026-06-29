import { PermissionModel } from './permissions.model';

export class PermissionRepository {
  findAll(filter: Record<string, unknown>, skip: number, limit: number) {
    return PermissionModel.find(filter).sort({ module: 1, resource: 1 }).skip(skip).limit(limit);
  }

  count(filter: Record<string, unknown>) {
    return PermissionModel.countDocuments(filter);
  }

  findByExternalIds(externalIds: string[]) {
    return PermissionModel.find({ externalId: { $in: externalIds } });
  }
}

export const permissionRepository = new PermissionRepository();
