import { parsePagination, buildMeta } from '../../shared/pagination/pagination.util';
import { approvalRepository } from './approvals.repository';
import { ApprovalDto } from './approvals.types';
import { ApprovalDocument } from './approvals.model';

function toDto(doc: ApprovalDocument): ApprovalDto {
  return {
    id: doc.externalId,
    tenantId: doc.tenantId,
    tenantName: doc.tenantName,
    guardrailId: doc.guardrailId,
    guardrailName: doc.guardrailName,
    module: doc.module,
    resource: doc.resource,
    requestedBy: doc.requestedBy,
    status: doc.status,
    requestedAt: doc.requestedAt.toISOString(),
  };
}

export class ApprovalService {
  async list(query: { page?: number; limit?: number; status?: string; tenantId?: string }) {
    const { page, limit, skip } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.tenantId) filter.tenantId = query.tenantId;
    const [items, total] = await Promise.all([
      approvalRepository.findAll(filter, skip, limit),
      approvalRepository.count(filter),
    ]);
    return { items: items.map(toDto), meta: buildMeta(page, limit, total) };
  }

  async countPending(): Promise<number> {
    return approvalRepository.countPending();
  }
}

export const approvalService = new ApprovalService();
