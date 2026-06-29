import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Module, ModuleKey } from '@/data/superadminData';
import { fetchModules, toggleModuleAccess } from '@/lib/api/module-access';
import { tenantQueryKeys } from '@/hooks/useTenantsApi';

export const moduleAccessQueryKeys = {
  all: ['module-access'] as const,
  modules: ['module-access', 'modules'] as const,
  list: ['module-access', 'list'] as const,
};

export function useModules() {
  return useQuery({
    queryKey: moduleAccessQueryKeys.modules,
    queryFn: fetchModules,
  });
}

export function useToggleModuleAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tenantId,
      module,
      enabled,
    }: {
      tenantId: string;
      module: ModuleKey;
      enabled: boolean;
    }) => toggleModuleAccess(tenantId, module, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: moduleAccessQueryKeys.all });
    },
  });
}

export type { Module };
