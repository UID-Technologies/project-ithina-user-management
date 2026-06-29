import { LocationModel, LocationDocument } from './organizations.model';

export class OrganizationRepository {
  findByTenantId(tenantId: string) {
    return LocationModel.find({ tenantId }).sort({ name: 1 });
  }

  findByExternalId(externalId: string) {
    return LocationModel.findOne({ externalId });
  }

  create(data: Partial<LocationDocument>) {
    return LocationModel.create(data);
  }

  updateByExternalId(externalId: string, data: Partial<LocationDocument>) {
    return LocationModel.findOneAndUpdate({ externalId }, data, { new: true });
  }

  deleteByExternalId(externalId: string) {
    return LocationModel.findOneAndDelete({ externalId });
  }

  deleteByExternalIds(externalIds: string[]): Promise<{ deletedCount?: number }> {
    return LocationModel.deleteMany({ externalId: { $in: externalIds } });
  }
}

export const organizationRepository = new OrganizationRepository();
