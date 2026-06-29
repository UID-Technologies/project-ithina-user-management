import { AuthUser } from '../interfaces/api.interface';

const PLATFORM_ROLE_IDS = new Set(['r-super', 'r-platform', 'r-support', 'r-module']);

export function isPlatformAdmin(user: AuthUser): boolean {
  return user.roleIds.some((id) => PLATFORM_ROLE_IDS.has(id));
}

/** Force tenant filter for non-platform workspace users. */
export function enforceTenantScope<T extends Record<string, unknown>>(
  user: AuthUser | undefined,
  query: T,
): T {
  if (!user || isPlatformAdmin(user) || user.tenantId === 'platform') {
    return query;
  }
  return { ...query, tenantId: user.tenantId };
}

/** Returns true when the resource tenant matches the workspace user. */
export function canAccessTenant(user: AuthUser | undefined, tenantId: string): boolean {
  if (!user) return false;
  if (isPlatformAdmin(user)) return true;
  return user.tenantId === tenantId;
}
