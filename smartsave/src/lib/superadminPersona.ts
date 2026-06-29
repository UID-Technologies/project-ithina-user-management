import type { AuthUser } from '@/lib/api/auth';

export type Persona = 'platform' | 'organization' | 'tenant';

export interface SuperadminSession {
  userId: string;
  email: string;
  name: string;
  persona: Persona;
  tenantId: string;
  tenantName: string;
  locationIds: string[];
  primaryRoleName: string;
}

const PLATFORM_ROLE_IDS = new Set(['r-super', 'r-platform', 'r-support', 'r-module']);

export function derivePersona(roleIds: string[]): Persona {
  const primaryRoleId = roleIds[0];
  if (!primaryRoleId) return 'tenant';
  if (PLATFORM_ROLE_IDS.has(primaryRoleId)) return 'platform';
  if (primaryRoleId === 'r-owner') return 'organization';
  return 'tenant';
}

/** Build session from enriched `/auth/me` profile. */
export function buildSessionFromProfile(user: AuthUser): SuperadminSession {
  const persona = derivePersona(user.roleIds);
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    persona,
    tenantId: user.tenantId,
    tenantName:
      user.tenantName ?? (user.tenantId === 'platform' ? 'Ithina Platform' : user.tenantId),
    locationIds: persona === 'tenant' ? (user.locationIds ?? []) : [],
    primaryRoleName: user.primaryRoleName ?? 'User',
  };
}
