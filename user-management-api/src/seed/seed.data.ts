import { ModuleKey } from '../common/enums';

export const modules = [
  { key: 'roos' as ModuleKey, name: 'ROOS', description: 'Retail Operating OS — orchestration core', color: '187 70% 42%' },
  { key: 'goal-console' as ModuleKey, name: 'Goal Console', description: 'OKR & target alignment across stores', color: '262 60% 55%' },
  { key: 'pricing-os' as ModuleKey, name: 'Pricing OS', description: 'Dynamic & promotional pricing engine', color: '4 84% 49%' },
  { key: 'perishables' as ModuleKey, name: 'Perishables Assistant', description: 'Freshness, expiry & waste prevention', color: '142 60% 42%' },
  { key: 'promotions' as ModuleKey, name: 'Promotions Assistant', description: 'Campaign planning & execution', color: '32 95% 50%' },
  { key: 'admin' as ModuleKey, name: 'Admin', description: 'Governance, RBAC, audit', color: '222 47% 30%' },
];

export const tenants = [
  { externalId: 't-bucees', name: "Buc-ee's", tier: 'Enterprise', industry: 'Convenience / Fuel', country: 'USA', storesCount: 47, usersCount: 312, status: 'active', modules: ['roos', 'goal-console', 'pricing-os', 'perishables', 'promotions', 'admin'] as ModuleKey[], primaryContact: 'Marcus Tanner', contactEmail: 'marcus.t@bucees.com', monthlyRevenue: 48500 },
  { externalId: 't-zabka', name: 'Żabka Group', tier: 'Enterprise', industry: 'Convenience', country: 'Poland', storesCount: 9842, usersCount: 1240, status: 'active', modules: ['roos', 'pricing-os', 'perishables', 'promotions', 'admin'] as ModuleKey[], primaryContact: 'Anna Kowalski', contactEmail: 'a.kowalski@zabka.pl', monthlyRevenue: 142000 },
  { externalId: 't-smartstore', name: 'SmartStore Demo', tier: 'Mid-Market', industry: 'Grocery', country: 'USA', storesCount: 12, usersCount: 64, status: 'active', modules: ['pricing-os', 'perishables', 'admin'] as ModuleKey[], primaryContact: 'Priya Shah', contactEmail: 'priya@smartstore.io', monthlyRevenue: 8400 },
  { externalId: 't-freshmart', name: 'FreshMart Co-op', tier: 'SMB', industry: 'Organic Grocery', country: 'Canada', storesCount: 4, usersCount: 18, status: 'trial', modules: ['perishables', 'admin'] as ModuleKey[], primaryContact: 'Daniel Brun', contactEmail: 'dan@freshmart.ca', monthlyRevenue: 0 },
  { externalId: 't-cornerstop', name: 'CornerStop', tier: 'Single-Store', industry: 'Convenience', country: 'UK', storesCount: 1, usersCount: 4, status: 'active', modules: ['perishables', 'promotions', 'admin'] as ModuleKey[], primaryContact: 'Aisha Patel', contactEmail: 'aisha@cornerstop.uk', monthlyRevenue: 240 },
  { externalId: 't-greenleaf', name: 'GreenLeaf Markets', tier: 'Mid-Market', industry: 'Specialty Grocery', country: 'USA', storesCount: 22, usersCount: 96, status: 'suspended', modules: ['roos', 'perishables', 'admin'] as ModuleKey[], primaryContact: 'Robert Chen', contactEmail: 'rchen@greenleaf.com', monthlyRevenue: 12600 },
  { externalId: 't-infomil', name: 'Infomil Retail', tier: 'Enterprise', industry: 'Hypermarket', country: 'France', storesCount: 156, usersCount: 482, status: 'active', modules: ['roos', 'goal-console', 'pricing-os', 'perishables', 'admin'] as ModuleKey[], primaryContact: 'Camille Rousseau', contactEmail: 'c.rousseau@infomil.fr', monthlyRevenue: 96400 },
];

export const rolePermissionMap: Record<string, string[]> = {
  'r-super': ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13'],
  'r-platform': ['p1', 'p2', 'p11', 'p12', 'p13'],
  'r-module': ['p1', 'p2', 'p9', 'p13'],
  'r-support': ['p1', 'p6', 'p13'],
  'r-owner': ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12'],
  'r-pricing-mgr': ['p1', 'p2', 'p3', 'p4'],
  'r-category-mgr': ['p1', 'p6', 'p9'],
  'r-merch': ['p1', 'p9'],
  'r-marketing': ['p9', 'p10'],
  'r-store-ops': ['p1', 'p3', 'p6'],
  'r-store-mgr': ['p1', 'p3', 'p4', 'p6', 'p7'],
  'r-associate': ['p6'],
  'r-finance': ['p1', 'p4', 'p7'],
  'r-it-analyst': ['p1', 'p13'],
  'r-cust-night': ['p1', 'p3', 'p6', 'p7'],
};

export const roles = [
  { externalId: 'r-super', name: 'Super Admin', type: 'Platform', description: 'Full platform control. Reserved for Ithina staff.', isCustom: false, usersCount: 4, permissionIds: rolePermissionMap['r-super'] },
  { externalId: 'r-platform', name: 'Platform Admin', type: 'Platform', description: 'Manage tenants, modules, billing. No tenant data access.', isCustom: false, inheritsFrom: ['r-super'], usersCount: 7, permissionIds: rolePermissionMap['r-platform'] },
  { externalId: 'r-module', name: 'Module Admin', type: 'Platform', description: 'Configure module-level features and defaults.', isCustom: false, usersCount: 12, permissionIds: rolePermissionMap['r-module'] },
  { externalId: 'r-support', name: 'Support Admin', type: 'Platform', description: 'Read-only access plus impersonation for support tickets.', isCustom: false, usersCount: 18, permissionIds: rolePermissionMap['r-support'] },
  { externalId: 'r-owner', name: 'Owner', type: 'Tenant', description: 'Tenant owner — full tenant scope.', isCustom: false, usersCount: 9, permissionIds: rolePermissionMap['r-owner'] },
  { externalId: 'r-pricing-mgr', name: 'Pricing Manager', type: 'Tenant', description: 'Configure pricing rules; approve markdowns.', isCustom: false, usersCount: 34, permissionIds: rolePermissionMap['r-pricing-mgr'] },
  { externalId: 'r-category-mgr', name: 'Category Manager', type: 'Tenant', description: 'Manage assortment & category strategy.', isCustom: false, usersCount: 52, permissionIds: rolePermissionMap['r-category-mgr'] },
  { externalId: 'r-merch', name: 'Merchandising', type: 'Tenant', description: 'Planogram, displays, in-store visuals.', isCustom: false, usersCount: 78, permissionIds: rolePermissionMap['r-merch'] },
  { externalId: 'r-marketing', name: 'Marketing', type: 'Tenant', description: 'Promotions, campaigns, signage.', isCustom: false, usersCount: 41, permissionIds: rolePermissionMap['r-marketing'] },
  { externalId: 'r-store-ops', name: 'Store Operations', type: 'Tenant', description: 'Day-to-day store running & compliance.', isCustom: false, usersCount: 184, permissionIds: rolePermissionMap['r-store-ops'] },
  { externalId: 'r-store-mgr', name: 'Store Manager', type: 'Tenant', description: 'Single-store leadership.', isCustom: false, usersCount: 412, permissionIds: rolePermissionMap['r-store-mgr'] },
  { externalId: 'r-associate', name: 'Associate', type: 'Tenant', description: 'Floor staff. Handheld + task execution only.', isCustom: false, usersCount: 1284, permissionIds: rolePermissionMap['r-associate'] },
  { externalId: 'r-finance', name: 'Finance', type: 'Tenant', description: 'Margin, P&L, reporting.', isCustom: false, usersCount: 22, permissionIds: rolePermissionMap['r-finance'] },
  { externalId: 'r-it-analyst', name: 'IT / Analyst', type: 'Tenant', description: 'Integrations, data exports, BI.', isCustom: false, usersCount: 19, permissionIds: rolePermissionMap['r-it-analyst'] },
  { externalId: 'r-cust-night', name: 'Night Shift Lead', type: 'Tenant', description: 'Custom — overnight ops + waste close-out.', isCustom: true, inheritsFrom: ['r-store-ops'], usersCount: 24, tenantId: 't-bucees', permissionIds: rolePermissionMap['r-cust-night'] },
];

export const permissions = [
  { externalId: 'p1', module: 'pricing-os', resource: 'Pricing Rules', action: 'VIEW', scope: 'Tenant' },
  { externalId: 'p2', module: 'pricing-os', resource: 'Pricing Rules', action: 'CONFIGURE', scope: 'Tenant' },
  { externalId: 'p3', module: 'pricing-os', resource: 'Markdowns', action: 'EXECUTE', scope: 'Store' },
  { externalId: 'p4', module: 'pricing-os', resource: 'Markdowns', action: 'APPROVE', scope: 'Region' },
  { externalId: 'p5', module: 'pricing-os', resource: 'Markdowns', action: 'OVERRIDE', scope: 'Tenant' },
  { externalId: 'p6', module: 'perishables', resource: 'Expiring Items', action: 'VIEW', scope: 'Store' },
  { externalId: 'p7', module: 'perishables', resource: 'Waste Log', action: 'AUDIT', scope: 'Tenant' },
  { externalId: 'p8', module: 'perishables', resource: 'Donation Routing', action: 'CONFIGURE', scope: 'Region' },
  { externalId: 'p9', module: 'promotions', resource: 'Campaigns', action: 'CONFIGURE', scope: 'Tenant' },
  { externalId: 'p10', module: 'promotions', resource: 'Campaigns', action: 'APPROVE', scope: 'Tenant' },
  { externalId: 'p11', module: 'admin', resource: 'Users', action: 'CONFIGURE', scope: 'Tenant' },
  { externalId: 'p12', module: 'admin', resource: 'Roles', action: 'CONFIGURE', scope: 'Tenant' },
  { externalId: 'p13', module: 'admin', resource: 'Audit Log', action: 'VIEW', scope: 'Global' },
];

export const users = [
  { externalId: 'u-1', name: 'Anjali Mehta', email: 'anjali@ithina.ai', tenantId: 'platform', roleIds: ['r-super'], locationIds: [] as string[], status: 'active', lastActive: '2 min ago', mfaEnabled: true },
  { externalId: 'u-2', name: 'Devon Park', email: 'devon@ithina.ai', tenantId: 'platform', roleIds: ['r-platform'], locationIds: [], status: 'active', lastActive: '14 min ago', mfaEnabled: true },
  { externalId: 'u-3', name: 'Kira Yilmaz', email: 'kira@ithina.ai', tenantId: 'platform', roleIds: ['r-support'], locationIds: [], status: 'active', lastActive: '1 hr ago', mfaEnabled: true },
  { externalId: 'u-4', name: 'Marcus Tanner', email: 'marcus.t@bucees.com', tenantId: 't-bucees', roleIds: ['r-owner'], locationIds: ['l-bu-hq'], status: 'active', lastActive: '32 min ago', mfaEnabled: true },
  { externalId: 'u-5', name: 'Jamie Cole', email: 'j.cole@bucees.com', tenantId: 't-bucees', roleIds: ['r-pricing-mgr'], locationIds: ['l-bu-hq', 'l-bu-tx'], status: 'active', lastActive: '5 min ago', mfaEnabled: true },
  { externalId: 'u-6', name: 'Tasha Vaughn', email: 't.vaughn@bucees.com', tenantId: 't-bucees', roleIds: ['r-store-mgr'], locationIds: ['l-bu-tx-101'], status: 'active', lastActive: '1 hr ago', mfaEnabled: false },
  { externalId: 'u-7', name: 'Hector Ruiz', email: 'h.ruiz@bucees.com', tenantId: 't-bucees', roleIds: ['r-cust-night', 'r-associate'], locationIds: ['l-bu-tx-101'], status: 'active', lastActive: '12 hr ago', mfaEnabled: false },
  { externalId: 'u-8', name: 'Anna Kowalski', email: 'a.kowalski@zabka.pl', tenantId: 't-zabka', roleIds: ['r-owner'], locationIds: ['l-zab-hq'], status: 'active', lastActive: '8 min ago', mfaEnabled: true },
  { externalId: 'u-9', name: 'Piotr Nowak', email: 'p.nowak@zabka.pl', tenantId: 't-zabka', roleIds: ['r-category-mgr', 'r-pricing-mgr'], locationIds: ['l-zab-warsaw', 'l-zab-krakow'], status: 'active', lastActive: '22 min ago', mfaEnabled: true },
  { externalId: 'u-10', name: 'Magda Lis', email: 'm.lis@zabka.pl', tenantId: 't-zabka', roleIds: ['r-store-mgr'], locationIds: ['l-zab-w-001'], status: 'active', lastActive: '3 hr ago', mfaEnabled: false },
  { externalId: 'u-11', name: 'Priya Shah', email: 'priya@smartstore.io', tenantId: 't-smartstore', roleIds: ['r-owner'], locationIds: ['l-ss-hq'], status: 'active', lastActive: 'Just now', mfaEnabled: true },
  { externalId: 'u-12', name: 'Liam Foster', email: 'liam@smartstore.io', tenantId: 't-smartstore', roleIds: ['r-store-mgr'], locationIds: ['l-ss-down'], status: 'active', lastActive: '1 day ago', mfaEnabled: false },
  { externalId: 'u-13', name: 'Daniel Brun', email: 'dan@freshmart.ca', tenantId: 't-freshmart', roleIds: ['r-owner'], locationIds: [], status: 'active', lastActive: '4 hr ago', mfaEnabled: true },
  { externalId: 'u-14', name: 'Aisha Patel', email: 'aisha@cornerstop.uk', tenantId: 't-cornerstop', roleIds: ['r-owner', 'r-store-mgr'], locationIds: [], status: 'active', lastActive: '30 min ago', mfaEnabled: false },
  { externalId: 'u-15', name: 'Robert Chen', email: 'rchen@greenleaf.com', tenantId: 't-greenleaf', roleIds: ['r-owner'], locationIds: [], status: 'suspended', lastActive: '12 days ago', mfaEnabled: true },
  { externalId: 'u-16', name: 'Camille Rousseau', email: 'c.rousseau@infomil.fr', tenantId: 't-infomil', roleIds: ['r-owner'], locationIds: [], status: 'active', lastActive: '1 hr ago', mfaEnabled: true },
  { externalId: 'u-17', name: 'Sara Olsson', email: 's.olsson@ithina.ai', tenantId: 'platform', roleIds: ['r-module'], locationIds: [], status: 'invited', lastActive: '—', mfaEnabled: false },
];

export const locations = [
  { externalId: 'l-bu-hq', tenantId: 't-bucees', name: "Buc-ee's HQ", type: 'HQ', parentId: null, code: 'BU-HQ' },
  { externalId: 'l-bu-tx', tenantId: 't-bucees', name: 'Texas Region', type: 'Region', parentId: 'l-bu-hq', code: 'TX' },
  { externalId: 'l-bu-fl', tenantId: 't-bucees', name: 'Florida Region', type: 'Region', parentId: 'l-bu-hq', code: 'FL' },
  { externalId: 'l-bu-tx-101', tenantId: 't-bucees', name: "Buc-ee's #101 New Braunfels", type: 'Store', parentId: 'l-bu-tx', code: 'TX-101' },
  { externalId: 'l-bu-tx-102', tenantId: 't-bucees', name: "Buc-ee's #102 Luling", type: 'Store', parentId: 'l-bu-tx', code: 'TX-102' },
  { externalId: 'l-bu-fl-201', tenantId: 't-bucees', name: "Buc-ee's #201 Daytona", type: 'Store', parentId: 'l-bu-fl', code: 'FL-201' },
  { externalId: 'l-bu-tx-101-deli', tenantId: 't-bucees', name: 'Deli Department', type: 'Department', parentId: 'l-bu-tx-101' },
  { externalId: 'l-bu-tx-101-bake', tenantId: 't-bucees', name: 'Bakery Department', type: 'Department', parentId: 'l-bu-tx-101' },
  { externalId: 'l-zab-hq', tenantId: 't-zabka', name: 'Żabka HQ Poznań', type: 'HQ', parentId: null, code: 'ZAB-HQ' },
  { externalId: 'l-zab-warsaw', tenantId: 't-zabka', name: 'Warsaw Region', type: 'Region', parentId: 'l-zab-hq', code: 'WAR' },
  { externalId: 'l-zab-krakow', tenantId: 't-zabka', name: 'Kraków Region', type: 'Region', parentId: 'l-zab-hq', code: 'KRK' },
  { externalId: 'l-zab-w-001', tenantId: 't-zabka', name: 'Żabka W-001 Mokotów', type: 'Store', parentId: 'l-zab-warsaw' },
  { externalId: 'l-zab-w-002', tenantId: 't-zabka', name: 'Żabka W-002 Praga', type: 'Store', parentId: 'l-zab-warsaw' },
  { externalId: 'l-zab-k-001', tenantId: 't-zabka', name: 'Żabka K-001 Stare Miasto', type: 'Store', parentId: 'l-zab-krakow' },
  { externalId: 'l-ss-hq', tenantId: 't-smartstore', name: 'SmartStore HQ', type: 'HQ', parentId: null },
  { externalId: 'l-ss-down', tenantId: 't-smartstore', name: 'Downtown Branch', type: 'Store', parentId: 'l-ss-hq' },
  { externalId: 'l-ss-up', tenantId: 't-smartstore', name: 'Uptown Branch', type: 'Store', parentId: 'l-ss-hq' },
];

export const guardrails = [
  { externalId: 'g-1', name: 'Markdown > 30%', module: 'pricing-os', trigger: 'Markdown depth exceeds 30%', approvers: ['r-pricing-mgr', 'r-owner'], escalateAfterHours: 4, overrideRoleId: 'r-owner', status: 'active' },
  { externalId: 'g-2', name: 'Bulk Donation Routing', module: 'perishables', trigger: 'Donation batch > 200 units', approvers: ['r-store-mgr'], escalateAfterHours: 12, overrideRoleId: 'r-owner', status: 'active' },
  { externalId: 'g-3', name: 'Promo Activation Tenant-Wide', module: 'promotions', trigger: 'Campaign scope = entire tenant', approvers: ['r-marketing', 'r-owner'], escalateAfterHours: 24, overrideRoleId: 'r-owner', status: 'active' },
  { externalId: 'g-4', name: 'Role Assignment > Manager', module: 'admin', trigger: 'Assigning Owner / Pricing Mgr', approvers: ['r-owner'], escalateAfterHours: 8, overrideRoleId: 'r-platform', status: 'active' },
  { externalId: 'g-5', name: 'Module Enable / Disable', module: 'admin', trigger: 'Toggling tenant module', approvers: ['r-platform'], escalateAfterHours: 48, overrideRoleId: 'r-super', status: 'active' },
  { externalId: 'g-6', name: 'Cross-Region Price Override', module: 'pricing-os', trigger: 'Override applied across > 1 region', approvers: ['r-owner'], escalateAfterHours: 2, overrideRoleId: 'r-super', status: 'draft' },
];

export const auditLogs = [
  { externalId: 'a-1', timestamp: new Date('2026-04-19T14:42:11'), actor: 'Anjali Mehta', actorRole: 'Super Admin', tenant: 'Platform', action: 'Enabled module', resource: "Promotions Assistant → Buc-ee's", scope: 'Tenant', result: 'success', ip: '10.0.4.22' },
  { externalId: 'a-2', timestamp: new Date('2026-04-19T14:38:02'), actor: 'Jamie Cole', actorRole: 'Pricing Manager', tenant: "Buc-ee's", action: 'Approved markdown', resource: 'SKU 88421 — 35% off', scope: 'Region', result: 'success', ip: '172.18.9.4' },
  { externalId: 'a-3', timestamp: new Date('2026-04-19T14:21:55'), actor: 'Piotr Nowak', actorRole: 'Category Manager', tenant: 'Żabka Group', action: 'Configured guardrail', resource: 'Markdown > 30%', scope: 'Tenant', result: 'pending', ip: '85.219.4.180' },
  { externalId: 'a-4', timestamp: new Date('2026-04-19T13:52:00'), actor: 'Hector Ruiz', actorRole: 'Night Shift Lead', tenant: "Buc-ee's", action: 'Override attempt', resource: 'Pricing rule lock', scope: 'Store', result: 'denied', ip: '172.18.9.55' },
  { externalId: 'a-5', timestamp: new Date('2026-04-19T13:18:44'), actor: 'Devon Park', actorRole: 'Platform Admin', tenant: 'Platform', action: 'Created tenant', resource: 'FreshMart Co-op (trial)', scope: 'Global', result: 'success', ip: '10.0.4.18' },
  { externalId: 'a-6', timestamp: new Date('2026-04-19T12:55:21'), actor: 'Magda Lis', actorRole: 'Store Manager', tenant: 'Żabka Group', action: 'Bulk donation routed', resource: '240 units → Caritas Warsaw', scope: 'Store', result: 'success', ip: '85.219.7.91' },
  { externalId: 'a-7', timestamp: new Date('2026-04-19T12:31:09'), actor: 'Kira Yilmaz', actorRole: 'Support Admin', tenant: 'GreenLeaf Markets', action: 'Impersonation start', resource: 'Owner session (45 min)', scope: 'Tenant', result: 'success', ip: '10.0.4.31' },
  { externalId: 'a-8', timestamp: new Date('2026-04-19T11:48:50'), actor: 'Marcus Tanner', actorRole: 'Owner', tenant: "Buc-ee's", action: 'Created custom role', resource: 'Night Shift Lead', scope: 'Tenant', result: 'success', ip: '67.221.8.12' },
  { externalId: 'a-9', timestamp: new Date('2026-04-19T11:14:33'), actor: 'Anna Kowalski', actorRole: 'Owner', tenant: 'Żabka Group', action: 'Invited user', resource: 'kasia.w@zabka.pl → Marketing', scope: 'Tenant', result: 'success', ip: '85.219.4.12' },
  { externalId: 'a-10', timestamp: new Date('2026-04-19T10:42:08'), actor: 'System', actorRole: '—', tenant: 'GreenLeaf Markets', action: 'Tenant suspended', resource: 'Billing failure (auto)', scope: 'Tenant', result: 'success', ip: '—' },
  { externalId: 'a-11', timestamp: new Date('2026-04-19T10:08:17'), actor: 'Anjali Mehta', actorRole: 'Super Admin', tenant: 'Platform', action: 'Permission grant', resource: 'AUDIT scope=Global → Module Admin', scope: 'Global', result: 'success', ip: '10.0.4.22' },
  { externalId: 'a-12', timestamp: new Date('2026-04-19T09:51:02'), actor: 'Camille Rousseau', actorRole: 'Owner', tenant: 'Infomil Retail', action: 'Module configured', resource: 'Goal Console — Q2 targets', scope: 'Tenant', result: 'success', ip: '193.51.4.88' },
];

export const pendingApprovals = [
  { externalId: 'ap-1', tenantId: 't-bucees', tenantName: "Buc-ee's", guardrailId: 'g-1', guardrailName: 'Markdown > 30%', module: 'pricing-os', resource: 'SKU 88421 — 35% off', requestedBy: 'Jamie Cole', status: 'pending' },
  { externalId: 'ap-2', tenantId: 't-zabka', tenantName: 'Żabka Group', guardrailId: 'g-1', guardrailName: 'Markdown > 30%', module: 'pricing-os', resource: 'Markdown > 30%', requestedBy: 'Piotr Nowak', status: 'pending' },
  { externalId: 'ap-3', tenantId: 't-bucees', tenantName: "Buc-ee's", guardrailId: 'g-3', guardrailName: 'Promo Activation Tenant-Wide', module: 'promotions', resource: 'Summer Fuel Promo', requestedBy: 'Marcus Tanner', status: 'pending' },
  { externalId: 'ap-4', tenantId: 't-infomil', tenantName: 'Infomil Retail', guardrailId: 'g-2', guardrailName: 'Bulk Donation Routing', module: 'perishables', resource: '220 units dairy', requestedBy: 'Camille Rousseau', status: 'pending' },
  { externalId: 'ap-5', tenantId: 't-greenleaf', tenantName: 'GreenLeaf Markets', guardrailId: 'g-1', guardrailName: 'Markdown > 30%', module: 'pricing-os', resource: 'Organic produce markdown', requestedBy: 'Robert Chen', status: 'pending' },
  { externalId: 'ap-6', tenantId: 't-smartstore', tenantName: 'SmartStore Demo', guardrailId: 'g-4', guardrailName: 'Role Assignment > Manager', module: 'admin', resource: 'Assign Pricing Manager', requestedBy: 'Priya Shah', status: 'pending' },
  { externalId: 'ap-7', tenantId: 't-zabka', tenantName: 'Żabka Group', guardrailId: 'g-2', guardrailName: 'Bulk Donation Routing', module: 'perishables', resource: '240 units → Caritas Warsaw', requestedBy: 'Magda Lis', status: 'pending' },
];

export function generateGuardrailEvents() {
  const now = Date.now();
  const events = [];
  const tenantsForEvents = [
    { id: 't-bucees', name: "Buc-ee's" },
    { id: 't-zabka', name: 'Żabka Group' },
    { id: 't-infomil', name: 'Infomil Retail' },
    { id: 't-greenleaf', name: 'GreenLeaf Markets' },
    { id: 't-smartstore', name: 'SmartStore Demo' },
  ];
  const rules = [
    { id: 'g-1', name: 'Markdown > 30%', module: 'pricing-os', trigger: 'Markdown depth exceeds 30%' },
    { id: 'g-2', name: 'Bulk Donation Routing', module: 'perishables', trigger: 'Donation batch > 200 units' },
    { id: 'g-3', name: 'Promo Activation Tenant-Wide', module: 'promotions', trigger: 'Campaign scope = entire tenant' },
  ];

  for (let i = 0; i < 23; i++) {
    const tenant = tenantsForEvents[i % tenantsForEvents.length];
    const rule = rules[i % rules.length];
    events.push({
      externalId: `ge-${i + 1}`,
      guardrailId: rule.id,
      guardrailName: rule.name,
      tenantId: tenant.id,
      tenantName: tenant.name,
      module: rule.module,
      trigger: rule.trigger,
      result: i % 7 === 0 ? 'escalated' : 'fired',
      firedAt: new Date(now - i * 45 * 60 * 1000),
    });
  }
  return events;
}

export const platformMetricsOverride = {
  key: 'platform',
  platformUsers: 8438,
  storesUnderManagement: 10084,
  mrr: 308100,
  pendingApprovals: 7,
  guardrailsFired24h: 23,
  guardrailEscalations24h: 3,
  customRoles: 1,
  modulesDeployed: 6,
  countriesCount: 9,
};
