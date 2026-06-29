import { GuardrailStatus, ModuleKey } from '../../common/enums';

export interface GuardrailRuleDto {
  id: string;
  name: string;
  module: ModuleKey;
  trigger: string;
  approvers: string[];
  escalateAfterHours: number;
  overrideRoleId: string;
  status: GuardrailStatus;
}

export interface GuardrailEventDto {
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

export interface CreateGuardrailRuleDto {
  name: string;
  module: ModuleKey;
  trigger: string;
  approvers: string[];
  escalateAfterHours: number;
  overrideRoleId: string;
  status: GuardrailStatus;
}

export type UpdateGuardrailRuleDto = Partial<CreateGuardrailRuleDto>;
