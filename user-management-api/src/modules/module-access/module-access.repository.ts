import { ModuleCatalogModel, TenantModuleAccessModel } from './module-access.model';

export class ModuleAccessRepository {
  findAllModules() {
    return ModuleCatalogModel.find().sort({ name: 1 });
  }

  findByTenantId(tenantId: string) {
    return TenantModuleAccessModel.findOne({ tenantId });
  }

  findAllTenantAccess() {
    return TenantModuleAccessModel.find();
  }

  upsertTenantAccess(tenantId: string, enabledModules: string[]) {
    return TenantModuleAccessModel.findOneAndUpdate(
      { tenantId },
      { enabledModules },
      { new: true, upsert: true },
    );
  }

  countModules() {
    return ModuleCatalogModel.countDocuments();
  }
}

export const moduleAccessRepository = new ModuleAccessRepository();
