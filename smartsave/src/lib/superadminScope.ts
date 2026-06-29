import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AuditLog, GuardrailRule, Location, Role, Tenant, User } from '@/data/superadminData';
import { useSuperadminAuth } from '@/contexts/SuperadminAuthProvider';
import { useTenants } from '@/hooks/useTenantsApi';
import { useUsers, useLocations } from '@/hooks/useUsersApi';
import { useRoles } from '@/hooks/useRolesApi';
import { useModules } from '@/hooks/useModuleAccessApi';
import { fetchAuditLogs } from '@/lib/api/audit';
import { fetchGuardrailRules } from '@/lib/api/guardrails';
import type { SuperadminSession } from '@/lib/superadminPersona';

export interface ScopedSuperadminData {
  tenants: Tenant[];
  users: User[];
  roles: Role[];
  locations: Location[];
  audit: AuditLog[];
  guardrails: GuardrailRule[];
  modulesCount: number;
  isLoading: boolean;
}

function expandLocationIds(locations: Location[], seedIds: string[]): Set<string> {
  const allowed = new Set<string>(seedIds);
  let changed = true;
  while (changed) {
    changed = false;
    for (const loc of locations) {
      if (loc.parentId && allowed.has(loc.parentId) && !allowed.has(loc.id)) {
        allowed.add(loc.id);
        changed = true;
      }
    }
  }
  return allowed;
}

export function scopeSuperadminData(
  full: {
    tenants: Tenant[];
    users: User[];
    roles: Role[];
    locations: Location[];
    audit: AuditLog[];
    guardrails: GuardrailRule[];
    modulesCount: number;
  },
  session: SuperadminSession | null,
): ScopedSuperadminData {
  if (!session || session.persona === 'platform') {
    return { ...full, isLoading: false };
  }

  const tenantId = session.tenantId;
  const tenants = full.tenants.filter((t) => t.id === tenantId);
  const locations = full.locations.filter((l) => l.tenantId === tenantId);

  const allowedLocationIds =
    session.persona === 'organization'
      ? new Set(locations.map((l) => l.id))
      : expandLocationIds(locations, session.locationIds);

  const scopedLocations =
    session.persona === 'organization'
      ? locations
      : locations.filter((l) => allowedLocationIds.has(l.id));

  const users = full.users.filter((u) => {
    if (u.tenantId !== tenantId) return false;
    if (session.persona === 'organization') return true;
    if (u.id === session.userId) return true;
    if (!u.locationIds?.length) return false;
    return u.locationIds.some((id) => allowedLocationIds.has(id));
  });

  const roles = full.roles.filter((r) => {
    if (r.type === 'Platform') return false;
    if (r.tenantId && r.tenantId !== tenantId) return false;
    return true;
  });

  const tenantName = tenants[0]?.name ?? session.tenantName;
  const audit = full.audit.filter((a) => a.tenant === tenantName);

  const guardrails = session.persona === 'organization' ? full.guardrails : [];

  const modulesCount =
    session.persona === 'platform' ? full.modulesCount : (tenants[0]?.modules.length ?? 0);

  return {
    tenants,
    users,
    roles,
    locations: scopedLocations,
    audit,
    guardrails,
    modulesCount,
    isLoading: false,
  };
}

export function canAccess(
  section:
    | 'dashboard'
    | 'tenants'
    | 'organization'
    | 'users'
    | 'roles'
    | 'modules'
    | 'guardrails'
    | 'audit',
  persona: SuperadminSession['persona'] | undefined,
) {
  if (!persona || persona === 'platform') return true;
  if (persona === 'organization') {
    return ['dashboard', 'tenants', 'organization', 'users', 'roles', 'modules', 'audit'].includes(
      section,
    );
  }
  return ['dashboard', 'organization', 'users', 'roles', 'audit'].includes(section);
}

export function useScopedSuperadminData(): ScopedSuperadminData {
  const { session } = useSuperadminAuth();
  const tenantFilter =
    session && session.persona !== 'platform' ? session.tenantId : undefined;

  const tenantsQuery = useTenants({ limit: 200 });
  const usersQuery = useUsers(
    tenantFilter ? { tenantId: tenantFilter, limit: 500 } : { limit: 500 },
  );
  const rolesQuery = useRoles();
  const locationsQuery = useLocations(tenantFilter);
  const modulesQuery = useModules();
  const auditQuery = useQuery({
    queryKey: ['audit', 'scoped', session?.persona, session?.tenantName],
    queryFn: () =>
      fetchAuditLogs({
        limit: 100,
        tenant: session?.persona !== 'platform' ? session?.tenantName : undefined,
      }),
    enabled: !!session,
  });
  const guardrailsEnabled =
    session?.persona === 'platform' || session?.persona === 'organization';
  const guardrailsQuery = useQuery({
    queryKey: ['guardrails', 'rules', session?.persona],
    queryFn: () => fetchGuardrailRules(),
    enabled: guardrailsEnabled,
  });

  const isLoading =
    tenantsQuery.isLoading ||
    usersQuery.isLoading ||
    rolesQuery.isLoading ||
    modulesQuery.isLoading ||
    auditQuery.isLoading ||
    (tenantFilter ? locationsQuery.isLoading : false) ||
    (guardrailsEnabled && guardrailsQuery.isLoading);

  return useMemo(() => {
    const full = {
      tenants: tenantsQuery.data ?? [],
      users: usersQuery.data ?? [],
      roles: rolesQuery.data ?? [],
      locations: locationsQuery.data ?? [],
      audit: auditQuery.data ?? [],
      guardrails: guardrailsQuery.data ?? [],
      modulesCount: modulesQuery.data?.length ?? 0,
    };
    const scoped = scopeSuperadminData(full, session);
    return { ...scoped, isLoading };
  }, [
    tenantsQuery.data,
    usersQuery.data,
    rolesQuery.data,
    locationsQuery.data,
    modulesQuery.data,
    auditQuery.data,
    guardrailsQuery.data,
    session,
    isLoading,
  ]);
}
