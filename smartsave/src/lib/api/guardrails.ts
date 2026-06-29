import type { GuardrailRule, ModuleKey } from '@/data/superadminData';
import { apiDelete, apiGetList, apiPost, apiPut } from './client';

export interface GuardrailEvent {
  id: string;
  guardrailId: string;
  guardrailName: string;
  tenantId: string;
  tenantName: string;
  module: ModuleKey;
  trigger: string;
  result: 'fired' | 'escalated' | 'blocked';
  firedAt: string;
}

export interface GuardrailListParams {
  page?: number;
  limit?: number;
}

export interface GuardrailEventListParams {
  page?: number;
  limit?: number;
  tenantId?: string;
  hours?: number;
}

export interface CreateGuardrailPayload {
  name: string;
  module: ModuleKey;
  trigger: string;
  approvers: string[];
  escalateAfterHours: number;
  overrideRoleId: string;
  status: GuardrailRule['status'];
}

export type UpdateGuardrailPayload = Partial<CreateGuardrailPayload>;

function buildRulesQuery(params: GuardrailListParams = {}): string {
  const query = new URLSearchParams();
  query.set('limit', String(params.limit ?? 100));
  query.set('page', String(params.page ?? 1));
  return query.toString();
}

function buildEventsQuery(params: GuardrailEventListParams = {}): string {
  const query = new URLSearchParams();
  query.set('limit', String(params.limit ?? 100));
  query.set('page', String(params.page ?? 1));
  if (params.tenantId) query.set('tenantId', params.tenantId);
  if (params.hours != null) query.set('hours', String(params.hours));
  return query.toString();
}

export async function fetchGuardrailRules(params?: GuardrailListParams): Promise<GuardrailRule[]> {
  const { items } = await apiGetList<GuardrailRule[]>(
    `/api/v1/superadmin/guardrails/rules?${buildRulesQuery(params)}`,
  );
  return items;
}

export async function fetchGuardrailEventsCount(params: GuardrailEventListParams = {}): Promise<number> {
  const { meta } = await apiGetList<GuardrailEvent[]>(
    `/api/v1/superadmin/guardrails/events?${buildEventsQuery({ ...params, limit: 1 })}`,
  );
  return meta?.total ?? 0;
}

export async function createGuardrailRule(payload: CreateGuardrailPayload): Promise<GuardrailRule> {
  return apiPost<GuardrailRule>('/api/v1/superadmin/guardrails/rules', payload);
}

export async function updateGuardrailRule(
  id: string,
  payload: UpdateGuardrailPayload,
): Promise<GuardrailRule> {
  return apiPut<GuardrailRule>(`/api/v1/superadmin/guardrails/rules/${id}`, payload);
}

export async function deleteGuardrailRule(id: string): Promise<void> {
  await apiDelete(`/api/v1/superadmin/guardrails/rules/${id}`);
}
