import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../../common/errors/app.errors';
import { parsePagination, buildMeta } from '../../shared/pagination/pagination.util';
import { writeAuditLog } from '../../common/utils/audit.util';
import { guardrailRepository } from './guardrails.repository';
import {
  CreateGuardrailRuleDto,
  GuardrailEventDto,
  GuardrailRuleDto,
  UpdateGuardrailRuleDto,
} from './guardrails.types';
import { GuardrailEventDocument, GuardrailRuleDocument } from './guardrails.model';

function toRuleDto(doc: GuardrailRuleDocument): GuardrailRuleDto {
  return {
    id: doc.externalId,
    name: doc.name,
    module: doc.module,
    trigger: doc.trigger,
    approvers: doc.approvers,
    escalateAfterHours: doc.escalateAfterHours,
    overrideRoleId: doc.overrideRoleId,
    status: doc.status,
  };
}

function toEventDto(doc: GuardrailEventDocument): GuardrailEventDto {
  return {
    id: doc.externalId,
    guardrailId: doc.guardrailId,
    guardrailName: doc.guardrailName,
    tenantId: doc.tenantId,
    tenantName: doc.tenantName,
    module: doc.module,
    trigger: doc.trigger,
    result: doc.result,
    firedAt: doc.firedAt.toISOString(),
  };
}

export class GuardrailService {
  async listRules(query: { page?: number; limit?: number }) {
    const { page, limit, skip } = parsePagination(query);
    const [items, total] = await Promise.all([
      guardrailRepository.findRules({}, skip, limit),
      guardrailRepository.countRules({}),
    ]);
    return { items: items.map(toRuleDto), meta: buildMeta(page, limit, total) };
  }

  async getRuleById(id: string): Promise<GuardrailRuleDto> {
    const rule = await guardrailRepository.findRuleByExternalId(id);
    if (!rule) throw new NotFoundError('Guardrail rule');
    return toRuleDto(rule);
  }

  async createRule(input: CreateGuardrailRuleDto, actor?: string): Promise<GuardrailRuleDto> {
    const rule = await guardrailRepository.createRule({
      externalId: `g-${uuidv4().slice(0, 8)}`,
      ...input,
    });
    await writeAuditLog({
      actor: actor ?? 'System',
      actorRole: 'Super Admin',
      tenant: 'Platform',
      action: 'Created guardrail',
      resource: rule.name,
      scope: 'Global',
      result: 'success',
    });
    return toRuleDto(rule);
  }

  async updateRule(
    id: string,
    input: UpdateGuardrailRuleDto,
    actor?: string,
  ): Promise<GuardrailRuleDto> {
    const rule = await guardrailRepository.updateRuleByExternalId(id, input);
    if (!rule) throw new NotFoundError('Guardrail rule');
    await writeAuditLog({
      actor: actor ?? 'System',
      actorRole: 'Super Admin',
      tenant: 'Platform',
      action: 'Updated guardrail',
      resource: rule.name,
      scope: 'Global',
      result: 'success',
    });
    return toRuleDto(rule);
  }

  async removeRule(id: string, actor?: string): Promise<void> {
    const rule = await guardrailRepository.deleteRuleByExternalId(id);
    if (!rule) throw new NotFoundError('Guardrail rule');
    await writeAuditLog({
      actor: actor ?? 'System',
      actorRole: 'Super Admin',
      tenant: 'Platform',
      action: 'Deleted guardrail',
      resource: rule.name,
      scope: 'Global',
      result: 'success',
    });
  }

  async listEvents(query: { page?: number; limit?: number; tenantId?: string; hours?: number }) {
    const { page, limit, skip } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.tenantId) filter.tenantId = query.tenantId;
    if (query.hours) {
      filter.firedAt = { $gte: new Date(Date.now() - query.hours * 60 * 60 * 1000) };
    }
    const [items, total] = await Promise.all([
      guardrailRepository.findEvents(filter, skip, limit),
      guardrailRepository.countEvents(filter),
    ]);
    return { items: items.map(toEventDto), meta: buildMeta(page, limit, total) };
  }

  async countFired24h(): Promise<{ fired: number; escalations: number }> {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [fired, escalations] = await Promise.all([
      guardrailRepository.countEventsSince(since),
      guardrailRepository.countEscalationsSince(since),
    ]);
    return { fired, escalations };
  }
}

export const guardrailService = new GuardrailService();
