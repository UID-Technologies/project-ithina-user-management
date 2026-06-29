import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { User } from '@/data/superadminData';
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
  UserListParams,
  CreateUserPayload,
  UpdateUserPayload,
} from '@/lib/api/users';
import { fetchLocations } from '@/lib/api/organizations';

export const userQueryKeys = {
  all: ['users'] as const,
  list: (params: UserListParams) => [...userQueryKeys.all, 'list', params] as const,
  locations: (tenantId: string) => ['locations', tenantId] as const,
};

export function useUsers(params: UserListParams = {}) {
  return useQuery({
    queryKey: userQueryKeys.list(params),
    queryFn: () => fetchUsers(params),
  });
}

export function useLocations(tenantId: string | undefined) {
  return useQuery({
    queryKey: userQueryKeys.locations(tenantId ?? ''),
    queryFn: () => fetchLocations(tenantId!),
    enabled: !!tenantId && tenantId !== 'platform',
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
}

export type { User };
