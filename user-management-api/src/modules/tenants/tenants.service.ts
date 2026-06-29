import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../../common/errors/app.errors';
import { parsePagination, buildMeta } from '../../shared/pagination/pagination.util';
import { writeAuditLog } from '../../common/utils/audit.util';
import { UserModel } from '../users/users.model';
import { TenantModuleAccessModel } from '../module-access/module-access.model';
import { LocationModel } from '../organizations/organizations.model';
import { tenantRepository } from './tenants.repository';
import { CreateTenantDto, TenantDto, UpdateTenantDto } from './tenants.types';
import { TenantDocument } from './tenants.model';

function toDto(doc: TenantDocument): TenantDto {
  return {
    id: doc.externalId,
    name: doc.name,
    tier: doc.tier,
    industry: doc.industry,
    country: doc.country,
    storesCount: doc.storesCount,
    usersCount: doc.usersCount,
    status: doc.status,
    createdAt: doc.createdAt.toISOString().split('T')[0],
    modules: doc.modules,
    primaryContact: doc.primaryContact,
    contactEmail: doc.contactEmail,
    monthlyRevenue: doc.monthlyRevenue,
  };
}

export class TenantService {
  async list(query: { page?: number; limit?: number; status?: string; tier?: string; search?: string }) {
    const { page, limit, skip } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.tier) filter.tier = query.tier;
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { industry: { $regex: query.search, $options: 'i' } },
      ];
    }
    const [items, total] = await Promise.all([
      tenantRepository.findAll(filter, skip, limit),
      tenantRepository.count(filter),
    ]);
    return { items: items.map(toDto), meta: buildMeta(page, limit, total) };
  }

  async getById(id: string): Promise<TenantDto> {
    const tenant = await tenantRepository.findByExternalId(id);
    if (!tenant) throw new NotFoundError('Tenant');
    return toDto(tenant);
  }

  async create(input: CreateTenantDto, actor?: string): Promise<TenantDto> {
    const externalId = `t-${uuidv4().slice(0, 8)}`;
    const tenant = await tenantRepository.create({
      externalId,
      name: input.name,
      tier: input.tier,
      industry: input.industry,
      country: input.country,
      storesCount: input.storesCount ?? 0,
      usersCount: 0,
      status: input.status ?? 'active',
      modules: input.modules ?? ['admin'],
      primaryContact: input.primaryContact ?? '',
      contactEmail: input.contactEmail ?? '',
      monthlyRevenue: input.monthlyRevenue ?? 0,
    });
    await TenantModuleAccessModel.create({
      tenantId: externalId,
      enabledModules: tenant.modules,
    });
    await writeAuditLog({
      actor: actor ?? 'System',
      actorRole: 'Super Admin',
      tenant: 'Platform',
      action: 'Created tenant',
      resource: `${tenant.name} (${tenant.tier})`,
      scope: 'Global',
      result: 'success',
    });
    return toDto(tenant);
  }

  async update(id: string, input: UpdateTenantDto, actor?: string): Promise<TenantDto> {
    const tenant = await tenantRepository.updateByExternalId(id, input);
    if (!tenant) throw new NotFoundError('Tenant');
    await writeAuditLog({
      actor: actor ?? 'System',
      actorRole: 'Super Admin',
      tenant: tenant.name,
      action: 'Updated tenant',
      resource: tenant.name,
      scope: 'Tenant',
      result: 'success',
    });
    return toDto(tenant);
  }

  async remove(id: string, actor?: string): Promise<void> {
    const tenant = await tenantRepository.findByExternalId(id);
    if (!tenant) throw new NotFoundError('Tenant');

    await Promise.all([
      LocationModel.deleteMany({ tenantId: id }),
      UserModel.deleteMany({ tenantId: id }),
      TenantModuleAccessModel.deleteMany({ tenantId: id }),
    ]);
    await tenantRepository.deleteByExternalId(id);

    await writeAuditLog({
      actor: actor ?? 'System',
      actorRole: 'Super Admin',
      tenant: 'Platform',
      action: 'Deleted tenant',
      resource: tenant.name,
      scope: 'Global',
      result: 'success',
    });
  }
}

export const tenantService = new TenantService();
