import { parsePagination, buildMeta } from '../../shared/pagination/pagination.util';
import { auditRepository } from './audit.repository';
import { AuditLogDto } from './audit.types';
import { AuditLogDocument } from './audit.model';

function toDto(doc: AuditLogDocument): AuditLogDto {
  const ts = doc.timestamp.toISOString().replace('T', ' ').slice(0, 19);
  return {
    id: doc.externalId,
    timestamp: ts,
    actor: doc.actor,
    actorRole: doc.actorRole,
    tenant: doc.tenant,
    action: doc.action,
    resource: doc.resource,
    scope: doc.scope,
    result: doc.result,
    ip: doc.ip,
  };
}

export class AuditService {
  async list(query: {
    page?: number;
    limit?: number;
    tenant?: string;
    result?: string;
    actor?: string;
    search?: string;
  }) {
    const { page, limit, skip } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.result) filter.result = query.result;
    if (query.search) {
      const regex = { $regex: query.search, $options: 'i' };
      filter.$or = [
        { actor: regex },
        { action: regex },
        { resource: regex },
        { tenant: regex },
      ];
    } else {
      if (query.tenant) filter.tenant = { $regex: query.tenant, $options: 'i' };
      if (query.actor) filter.actor = { $regex: query.actor, $options: 'i' };
    }
    const [items, total] = await Promise.all([
      auditRepository.findAll(filter, skip, limit),
      auditRepository.count(filter),
    ]);
    return { items: items.map(toDto), meta: buildMeta(page, limit, total) };
  }

  async getRecent(limit = 6): Promise<AuditLogDto[]> {
    const items = await auditRepository.findRecent(limit);
    return items.map(toDto);
  }
}

export const auditService = new AuditService();
