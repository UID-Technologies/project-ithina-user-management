import { logger } from '../config/logger.config';
import { TenantModel } from '../modules/tenants/tenants.model';
import { PlatformMetricsModel } from '../modules/dashboard/dashboard.model';

export async function syncTenantMetricsJob(): Promise<void> {
  const agg = await TenantModel.aggregate([
    {
      $group: {
        _id: null,
        totalStores: { $sum: '$storesCount' },
        monthlyRevenue: { $sum: '$monthlyRevenue' },
      },
    },
  ]);

  const metrics = agg[0];
  if (!metrics) return;

  await PlatformMetricsModel.findOneAndUpdate(
    { key: 'platform' },
    {
      storesUnderManagement: metrics.totalStores,
      mrr: metrics.monthlyRevenue,
    },
    { upsert: true },
  );

  logger.info('Tenant metrics sync job completed');
}
