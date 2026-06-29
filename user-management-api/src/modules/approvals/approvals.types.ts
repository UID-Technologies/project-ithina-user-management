import { ApprovalStatus, ModuleKey } from '../../common/enums';

export interface ApprovalDto {
  id: string;
  tenantId: string;
  tenantName: string;
  guardrailId: string;
  guardrailName: string;
  module: ModuleKey;
  resource: string;
  requestedBy: string;
  status: ApprovalStatus;
  requestedAt: string;
}
