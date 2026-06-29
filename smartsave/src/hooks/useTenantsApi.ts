import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Tenant } from '@/data/superadminData';
import {
  createTenant,
  deleteTenant,
  fetchTenants,
  updateTenant,
  TenantListParams,
  CreateTenantPayload,
  UpdateTenantPayload,
} from '@/lib/api/tenants';

export const tenantQueryKeys = {
  all: ['tenants'] as const,
  list: (params: TenantListParams) => [...tenantQueryKeys.all, 'list', params] as const,
};

export function useTenants(params: TenantListParams = {}) {
  return useQuery({
    queryKey: tenantQueryKeys.list(params),
    queryFn: () => fetchTenants(params),
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTenantPayload) => createTenant(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.all });
    },
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTenantPayload }) =>
      updateTenant(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.all });
    },
  });
}

export function useDeleteTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.all });
    },
  });
}

export type { Tenant };
