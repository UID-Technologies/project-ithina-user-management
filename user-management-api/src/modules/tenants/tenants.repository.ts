import { TenantModel, TenantDocument } from './tenants.model';

export class TenantRepository {
  findAll(filter: Record<string, unknown>, skip: number, limit: number) {
    return TenantModel.find(filter).sort({ name: 1 }).skip(skip).limit(limit);
  }

  count(filter: Record<string, unknown>) {
    return TenantModel.countDocuments(filter);
  }

  findByExternalId(externalId: string) {
    return TenantModel.findOne({ externalId });
  }

  findTopByUsers(limit: number) {
    return TenantModel.find().sort({ usersCount: -1 }).limit(limit);
  }

  create(data: Partial<TenantDocument>) {
    return TenantModel.create(data);
  }

  updateByExternalId(externalId: string, data: Partial<TenantDocument>) {
    return TenantModel.findOneAndUpdate({ externalId }, data, { new: true });
  }

  deleteByExternalId(externalId: string) {
    return TenantModel.findOneAndDelete({ externalId });
  }

  aggregateMetrics() {
    return TenantModel.aggregate([
      {
        $group: {
          _id: null,
          totalTenants: { $sum: 1 },
          activeTenants: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
          },
          trialTenants: {
            $sum: { $cond: [{ $eq: ['$status', 'trial'] }, 1, 0] },
          },
          suspendedTenants: {
            $sum: { $cond: [{ $eq: ['$status', 'suspended'] }, 1, 0] },
          },
          totalStores: { $sum: '$storesCount' },
          monthlyRevenue: { $sum: '$monthlyRevenue' },
        },
      },
    ]);
  }
}

export const tenantRepository = new TenantRepository();
