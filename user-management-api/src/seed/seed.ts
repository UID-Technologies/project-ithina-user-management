import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../infrastructure/database/mongoose.connection';
import { env } from '../config/env.config';
import { logger } from '../config/logger.config';
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
import { clearAllData } from './clear-data';
import { permissions, roles } from './role.seed';
import { users } from './user.seed';
import {
  modules,
  tenants,
  locations,
  guardrails,
  auditLogs,
  pendingApprovals,
  generateGuardrailEvents,
  platformMetricsOverride,
} from './tenant.seed';

export async function runSeed(): Promise<void> {
  await connectDatabase();
  logger.info('Clearing existing data...');
  await clearAllData();

  logger.info('Seeding modules...');
  await ModuleCatalogModel.insertMany(modules);

  logger.info('Seeding permissions...');
  await PermissionModel.insertMany(permissions);

  logger.info('Seeding roles...');
  await RoleModel.insertMany(
    roles.map((r) => ({
      ...r,
      inheritsFrom: r.inheritsFrom ?? [],
    })),
  );

  logger.info('Seeding tenants...');
  await TenantModel.insertMany(tenants);

  logger.info('Seeding tenant module access...');
  await TenantModuleAccessModel.insertMany(
    tenants.map((t) => ({ tenantId: t.externalId, enabledModules: t.modules })),
  );

  logger.info('Seeding locations...');
  await LocationModel.insertMany(locations);

  logger.info('Seeding users...');
  await UserModel.insertMany(users);

  logger.info('Seeding guardrail rules...');
  await GuardrailRuleModel.insertMany(guardrails);

  logger.info('Seeding guardrail events...');
  await GuardrailEventModel.insertMany(generateGuardrailEvents());

  logger.info('Seeding audit logs...');
  await AuditLogModel.insertMany(auditLogs);

  logger.info('Seeding pending approvals...');
  await ApprovalModel.insertMany(
    pendingApprovals.map((a) => ({ ...a, requestedAt: new Date() })),
  );

  logger.info('Seeding platform metrics override...');
  await PlatformMetricsModel.create(platformMetricsOverride);

  logger.info('Seeding super admin auth account...');
  const passwordHash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 12);
  const demoPasswordHash = await bcrypt.hash('DemoAdmin123!', 12);
  await AuthAccountModel.insertMany([
    { externalId: 'auth-u-1', email: env.SEED_ADMIN_EMAIL, passwordHash, userId: 'u-1' },
    { externalId: 'auth-u-4', email: 'marcus.t@bucees.com', passwordHash: demoPasswordHash, userId: 'u-4' },
    { externalId: 'auth-u-8', email: 'a.kowalski@zabka.pl', passwordHash: demoPasswordHash, userId: 'u-8' },
    { externalId: 'auth-u-11', email: 'priya@smartstore.io', passwordHash: demoPasswordHash, userId: 'u-11' },
    { externalId: 'auth-u-5', email: 'j.cole@bucees.com', passwordHash: demoPasswordHash, userId: 'u-5' },
    { externalId: 'auth-u-9', email: 'p.nowak@zabka.pl', passwordHash: demoPasswordHash, userId: 'u-9' },
  ]);

  logger.info('Seed completed successfully');
  logger.info(`Platform login: ${env.SEED_ADMIN_EMAIL} / ${env.SEED_ADMIN_PASSWORD}`);
  logger.info('Org/Tenant demo logins (all): DemoAdmin123!');
}

if (require.main === module) {
  runSeed()
    .catch((err) => {
      logger.error({ err }, 'Seed failed');
      process.exitCode = 1;
    })
    .finally(async () => {
      await disconnectDatabase();
      await mongoose.connection.close();
    });
}
