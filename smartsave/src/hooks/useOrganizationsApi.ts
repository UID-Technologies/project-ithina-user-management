import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Location } from '@/data/superadminData';
import {
  createLocation,
  deleteLocation,
  fetchLocations,
  updateLocation,
  CreateLocationPayload,
  UpdateLocationPayload,
} from '@/lib/api/organizations';

export const organizationQueryKeys = {
  all: ['organizations'] as const,
  list: (tenantId: string) => [...organizationQueryKeys.all, 'list', tenantId] as const,
};

export function useOrganizationLocations(tenantId: string | undefined) {
  return useQuery({
    queryKey: organizationQueryKeys.list(tenantId ?? ''),
    queryFn: () => fetchLocations(tenantId!),
    enabled: !!tenantId && tenantId !== 'platform',
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLocationPayload) => createLocation(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.list(variables.tenantId),
      });
      queryClient.invalidateQueries({ queryKey: ['locations', variables.tenantId] });
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLocationPayload }) =>
      updateLocation(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: organizationQueryKeys.list(data.tenantId) });
      queryClient.invalidateQueries({ queryKey: ['locations', data.tenantId] });
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; tenantId: string }) => deleteLocation(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.list(variables.tenantId),
      });
      queryClient.invalidateQueries({ queryKey: ['locations', variables.tenantId] });
    },
  });
}

export type { Location };
