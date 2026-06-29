import { NotFoundError } from '../../common/errors/app.errors';
import { writeAuditLog } from '../../common/utils/audit.util';
import { ModuleKey } from '../../common/enums';
import { tenantRepository } from '../tenants/tenants.repository';
import { moduleAccessRepository } from './module-access.repository';
import { ModuleDto, PatchModuleAccessDto, TenantModuleAccessDto } from './module-access.types';
import { ModuleCatalogDocument } from './module-access.model';

function toModuleDto(doc: ModuleCatalogDocument): ModuleDto {
  return {
    key: doc.key,
    name: doc.name,
    description: doc.description,
    color: doc.color,
  };
}

export class ModuleAccessService {
  async listModules(): Promise<ModuleDto[]> {
    const modules = await moduleAccessRepository.findAllModules();
    return modules.map(toModuleDto);
  }

  async getTenantAccess(tenantId: string): Promise<TenantModuleAccessDto> {
    const access = await moduleAccessRepository.findByTenantId(tenantId);
    if (!access) {
      const tenant = await tenantRepository.findByExternalId(tenantId);
      if (!tenant) throw new NotFoundError('Tenant');
      return { tenantId, enabledModules: tenant.modules };
    }
    return { tenantId: access.tenantId, enabledModules: access.enabledModules };
  }

  async listAllTenantAccess(): Promise<TenantModuleAccessDto[]> {
    const items = await moduleAccessRepository.findAllTenantAccess();
    return items.map((a) => ({
      tenantId: a.tenantId,
      enabledModules: a.enabledModules,
    }));
  }

  async patchTenantAccess(
    tenantId: string,
    input: PatchModuleAccessDto,
    actor?: string,
  ): Promise<TenantModuleAccessDto> {
    const tenant = await tenantRepository.findByExternalId(tenantId);
    if (!tenant) throw new NotFoundError('Tenant');

    const access = await moduleAccessRepository.upsertTenantAccess(tenantId, input.enabledModules);
    await tenantRepository.updateByExternalId(tenantId, { modules: input.enabledModules });

    await writeAuditLog({
      actor: actor ?? 'System',
      actorRole: 'Super Admin',
      tenant: tenant.name,
      action: 'Updated module access',
      resource: input.enabledModules.join(', '),
      scope: 'Tenant',
      result: 'success',
    });

    return { tenantId: access!.tenantId, enabledModules: access!.enabledModules };
  }

  /** Matches frontend `toggleModule(tenantId, moduleKey, enabled)` */
  async toggleModule(
    tenantId: string,
    module: ModuleKey,
    enabled: boolean,
    actor?: string,
  ): Promise<TenantModuleAccessDto> {
    const tenant = await tenantRepository.findByExternalId(tenantId);
    if (!tenant) throw new NotFoundError('Tenant');

    const current = await this.getTenantAccess(tenantId);
    const next = enabled
      ? Array.from(new Set([...current.enabledModules, module]))
      : current.enabledModules.filter((m) => m !== module);

    const access = await moduleAccessRepository.upsertTenantAccess(tenantId, next);
    await tenantRepository.updateByExternalId(tenantId, { modules: next });

    const catalog = await moduleAccessRepository.findAllModules();
    const modName = catalog.find((m) => m.key === module)?.name ?? module;

    await writeAuditLog({
      actor: actor ?? 'System',
      actorRole: 'Super Admin',
      tenant: tenant.name,
      action: enabled ? 'Enabled module' : 'Disabled module',
      resource: `${modName} → ${tenant.name}`,
      scope: 'Tenant',
      result: 'success',
    });

    return { tenantId: access!.tenantId, enabledModules: access!.enabledModules };
  }
}

export const moduleAccessService = new ModuleAccessService();
