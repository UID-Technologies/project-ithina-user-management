import { ModuleCatalogModel, TenantModuleAccessModel } from '../modules/module-access/module-access.model';
import { TenantModel } from '../modules/tenants/tenants.model';
import { LocationModel } from '../modules/organizations/organizations.model';
import { RoleModel } from '../modules/roles/roles.model';
import { PermissionModel } from '../modules/permissions/permissions.model';
import { UserModel } from '../modules/users/users.model';
import { GuardrailRuleModel, GuardrailEventModel } from '../modules/guardrails/guardrails.model';
import { AuditLogModel } from '../modules/audit/audit.model';
import { ApprovalModel } from '../modules/approvals/approvals.model';
import { AuthAccountModel } from '../modules/auth/auth.model';
import { PlatformMetricsModel } from '../modules/dashboard/dashboard.model';
import { logger } from '../config/logger.config';

/** Deletes all superadmin / RBAC collections (does not drop the database). */
export async function clearAllData(): Promise<void> {
  const results = await Promise.all([
    AuthAccountModel.deleteMany({}),
    UserModel.deleteMany({}),
    RoleModel.deleteMany({}),
    PermissionModel.deleteMany({}),
    TenantModel.deleteMany({}),
    LocationModel.deleteMany({}),
    ModuleCatalogModel.deleteMany({}),
    TenantModuleAccessModel.deleteMany({}),
    GuardrailRuleModel.deleteMany({}),
    GuardrailEventModel.deleteMany({}),
    AuditLogModel.deleteMany({}),
    ApprovalModel.deleteMany({}),
    PlatformMetricsModel.deleteMany({}),
  ]);

  const total = results.reduce((sum, r) => sum + (r.deletedCount ?? 0), 0);
  logger.info({ documentsRemoved: total }, 'Cleared all application collections');
}
