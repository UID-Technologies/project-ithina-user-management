import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Permission, Role } from '@/data/superadminData';
import {
  createRole,
  deleteRole,
  fetchRoles,
  updateRole,
  RoleListParams,
  CreateRolePayload,
  UpdateRolePayload,
} from '@/lib/api/roles';
import { fetchPermissions, fetchRolePermissionMap } from '@/lib/api/permissions';

export const roleQueryKeys = {
  all: ['roles'] as const,
  list: (params: RoleListParams) => [...roleQueryKeys.all, 'list', params] as const,
  permissions: ['permissions'] as const,
  roleMap: ['role-permission-map'] as const,
};

export function useRoles(params: RoleListParams = {}) {
  return useQuery({
    queryKey: roleQueryKeys.list(params),
    queryFn: () => fetchRoles(params),
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: roleQueryKeys.permissions,
    queryFn: () => fetchPermissions({ limit: 100 }),
  });
}

export function useRolePermissionMap() {
  return useQuery({
    queryKey: roleQueryKeys.roleMap,
    queryFn: fetchRolePermissionMap,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRolePayload) => createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.roleMap });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRolePayload }) =>
      updateRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.roleMap });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.roleMap });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
}

// Avoid circular import — inline user key for invalidation
const userQueryKeys = { all: ['users'] as const };

export type { Role, Permission };
