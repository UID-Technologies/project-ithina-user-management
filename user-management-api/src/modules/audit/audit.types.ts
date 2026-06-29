import { AuditResult, PermissionScope } from '../../common/enums';

export interface AuditLogDto {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  tenant: string;
  action: string;
  resource: string;
  scope: PermissionScope;
  result: AuditResult;
  ip: string;
}
