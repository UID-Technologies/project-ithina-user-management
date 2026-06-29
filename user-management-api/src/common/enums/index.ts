export const MODULE_KEYS = [
  'roos',
  'goal-console',
  'pricing-os',
  'perishables',
  'promotions',
  'admin',
] as const;

export type ModuleKey = (typeof MODULE_KEYS)[number];

export const PERMISSION_ACTIONS = [
  'VIEW',
  'CONFIGURE',
  'EXECUTE',
  'APPROVE',
  'OVERRIDE',
  'AUDIT',
] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export const PERMISSION_SCOPES = ['Global', 'Tenant', 'Country', 'Region', 'Store'] as const;
export type PermissionScope = (typeof PERMISSION_SCOPES)[number];

export const ROLE_TYPES = ['Platform', 'Tenant'] as const;
export type RoleType = (typeof ROLE_TYPES)[number];

export const TENANT_TIERS = ['Enterprise', 'Mid-Market', 'SMB', 'Single-Store'] as const;
export type TenantTier = (typeof TENANT_TIERS)[number];

export const TENANT_STATUSES = ['active', 'suspended', 'trial'] as const;
export type TenantStatus = (typeof TENANT_STATUSES)[number];

export const USER_STATUSES = ['active', 'invited', 'suspended'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const LOCATION_TYPES = [
  'BusinessUnit',
  'HQ',
  'Country',
  'Region',
  'Store',
  'Department',
] as const;

export type LocationType = (typeof LOCATION_TYPES)[number];

export const AUDIT_RESULTS = ['success', 'denied', 'pending'] as const;
export type AuditResult = (typeof AUDIT_RESULTS)[number];

export const GUARDRAIL_STATUSES = ['active', 'draft'] as const;
export type GuardrailStatus = (typeof GUARDRAIL_STATUSES)[number];

export const APPROVAL_STATUSES = ['pending', 'approved', 'rejected', 'escalated'] as const;
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];
