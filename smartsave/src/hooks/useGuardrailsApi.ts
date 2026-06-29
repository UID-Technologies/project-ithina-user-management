import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { GuardrailRule } from '@/data/superadminData';
import {
  createGuardrailRule,
  deleteGuardrailRule,
  fetchGuardrailEventsCount,
  fetchGuardrailRules,
  updateGuardrailRule,
  CreateGuardrailPayload,
  UpdateGuardrailPayload,
} from '@/lib/api/guardrails';

export const guardrailQueryKeys = {
  all: ['guardrails'] as const,
  rules: ['guardrails', 'rules'] as const,
  events24h: ['guardrails', 'events', '24h'] as const,
};

export function useGuardrailRules() {
  return useQuery({
    queryKey: guardrailQueryKeys.rules,
    queryFn: () => fetchGuardrailRules(),
  });
}

export function useGuardrailEvents24h() {
  return useQuery({
    queryKey: guardrailQueryKeys.events24h,
    queryFn: () => fetchGuardrailEventsCount({ hours: 24 }),
  });
}

export function useCreateGuardrail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGuardrailPayload) => createGuardrailRule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guardrailQueryKeys.all });
    },
  });
}

export function useUpdateGuardrail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGuardrailPayload }) =>
      updateGuardrailRule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guardrailQueryKeys.all });
    },
  });
}

export function useDeleteGuardrail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGuardrailRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guardrailQueryKeys.all });
    },
  });
}

export type { GuardrailRule };
