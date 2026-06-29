import { RoleModel, RoleDocument } from './roles.model';

export class RoleRepository {
  findAll(filter: Record<string, unknown>, skip: number, limit: number) {
    return RoleModel.find(filter).sort({ name: 1 }).skip(skip).limit(limit);
  }

  count(filter: Record<string, unknown>) {
    return RoleModel.countDocuments(filter);
  }

  findByExternalId(externalId: string) {
    return RoleModel.findOne({ externalId });
  }

  findByExternalIds(externalIds: string[]) {
    return RoleModel.find({ externalId: { $in: externalIds } });
  }

  create(data: Partial<RoleDocument>) {
    return RoleModel.create(data);
  }

  updateByExternalId(externalId: string, data: Partial<RoleDocument>) {
    return RoleModel.findOneAndUpdate({ externalId }, data, { new: true });
  }

  deleteByExternalId(externalId: string) {
    return RoleModel.findOneAndDelete({ externalId });
  }

  countCustom() {
    return RoleModel.countDocuments({ isCustom: true });
  }

  countAll() {
    return RoleModel.countDocuments();
  }
}

export const roleRepository = new RoleRepository();
