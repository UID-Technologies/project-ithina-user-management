import { useQuery } from '@tanstack/react-query';
import type { AuditLog } from '@/data/superadminData';
import { fetchAuditLogs, AuditListParams } from '@/lib/api/audit';

export const auditQueryKeys = {
  all: ['audit'] as const,
  list: (params: AuditListParams) => [...auditQueryKeys.all, 'list', params] as const,
};

export function useAuditLogs(params: AuditListParams = {}) {
  return useQuery({
    queryKey: auditQueryKeys.list(params),
    queryFn: () => fetchAuditLogs(params),
  });
}

export type { AuditLog };
