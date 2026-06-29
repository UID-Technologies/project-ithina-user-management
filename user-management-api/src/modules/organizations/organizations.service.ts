import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../../common/errors/app.errors';
import { writeAuditLog } from '../../common/utils/audit.util';
import { tenantRepository } from '../tenants/tenants.repository';
import { organizationRepository } from './organizations.repository';
import { CreateLocationDto, LocationDto, UpdateLocationDto } from './organizations.types';
import { LocationDocument } from './organizations.model';

function toDto(doc: LocationDocument): LocationDto {
  return {
    id: doc.externalId,
    tenantId: doc.tenantId,
    name: doc.name,
    type: doc.type,
    parentId: doc.parentId,
    code: doc.code,
  };
}

function buildTree(locations: LocationDocument[]): LocationDto[] {
  const map = new Map<string, LocationDto>();
  const roots: LocationDto[] = [];

  locations.forEach((loc) => {
    map.set(loc.externalId, { ...toDto(loc), children: [] });
  });

  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

function collectDescendantIds(
  locations: LocationDocument[],
  rootId: string,
): Set<string> {
  const ids = new Set<string>([rootId]);
  const collect = (parentId: string) => {
    locations
      .filter((l) => l.parentId === parentId)
      .forEach((child) => {
        ids.add(child.externalId);
        collect(child.externalId);
      });
  };
  collect(rootId);
  return ids;
}

async function resolveTenantName(tenantId: string): Promise<string> {
  const tenant = await tenantRepository.findByExternalId(tenantId);
  return tenant?.name ?? tenantId;
}

export class OrganizationService {
  async listFlat(tenantId: string): Promise<LocationDto[]> {
    const locations = await organizationRepository.findByTenantId(tenantId);
    return locations.map(toDto);
  }

  async getTree(tenantId: string): Promise<LocationDto[]> {
    const locations = await organizationRepository.findByTenantId(tenantId);
    return buildTree(locations);
  }

  async getById(id: string): Promise<LocationDto> {
    const loc = await organizationRepository.findByExternalId(id);
    if (!loc) throw new NotFoundError('Location');
    return toDto(loc);
  }

  async create(input: CreateLocationDto, actor?: string): Promise<LocationDto> {
    const loc = await organizationRepository.create({
      externalId: `l-${uuidv4().slice(0, 8)}`,
      tenantId: input.tenantId,
      name: input.name,
      type: input.type,
      parentId: input.parentId ?? null,
      code: input.code,
    });
    const tenantName = await resolveTenantName(input.tenantId);
    await writeAuditLog({
      actor: actor ?? 'System',
      actorRole: 'Super Admin',
      tenant: tenantName,
      action: 'Added org node',
      resource: `${loc.type}: ${loc.name}`,
      scope: 'Tenant',
      result: 'success',
    });
    return toDto(loc);
  }

  async update(id: string, input: UpdateLocationDto, actor?: string): Promise<LocationDto> {
    const loc = await organizationRepository.updateByExternalId(id, input);
    if (!loc) throw new NotFoundError('Location');
    const tenantName = await resolveTenantName(loc.tenantId);
    await writeAuditLog({
      actor: actor ?? 'System',
      actorRole: 'Super Admin',
      tenant: tenantName,
      action: 'Updated org node',
      resource: loc.name,
      scope: 'Tenant',
      result: 'success',
    });
    return toDto(loc);
  }

  async remove(id: string, actor?: string): Promise<void> {
    const loc = await organizationRepository.findByExternalId(id);
    if (!loc) throw new NotFoundError('Location');

    const all = await organizationRepository.findByTenantId(loc.tenantId);
    const idsToDelete = [...collectDescendantIds(all, id)];
    await organizationRepository.deleteByExternalIds(idsToDelete);

    const tenantName = await resolveTenantName(loc.tenantId);
    await writeAuditLog({
      actor: actor ?? 'System',
      actorRole: 'Super Admin',
      tenant: tenantName,
      action: 'Removed org node',
      resource: loc.name,
      scope: 'Tenant',
      result: 'success',
    });
  }
}

export const organizationService = new OrganizationService();
