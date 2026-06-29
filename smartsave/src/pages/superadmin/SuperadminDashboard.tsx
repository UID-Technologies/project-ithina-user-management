import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2, Users, Store, DollarSign, ShieldAlert, Activity,
  Boxes, ArrowUpRight, Crown, Server, Lock, Loader2,
} from "lucide-react";
import { useScopedSuperadminData } from "@/lib/superadminScope";
import { useSuperadminAuth } from "@/contexts/SuperadminAuthProvider";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardSummary,
  fetchPlatformHealth,
  fetchRecentActivity,
} from "@/lib/api/dashboard";

const KPI = ({
  label, value, sub, icon: Icon, accent = "blue", trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: typeof Building2;
  accent?: string;
  trend?: string;
}) => {
  const accents: Record<string, string> = {
    blue: "from-[hsl(217,91%,60%)] to-[hsl(217,91%,45%)]",
    purple: "from-[hsl(262,60%,55%)] to-[hsl(262,60%,40%)]",
    teal: "from-[hsl(187,70%,42%)] to-[hsl(187,70%,32%)]",
    amber: "from-[hsl(32,95%,50%)] to-[hsl(32,95%,40%)]",
    red: "from-[hsl(4,84%,55%)] to-[hsl(4,84%,40%)]",
    green: "from-[hsl(142,60%,42%)] to-[hsl(142,60%,32%)]",
  };
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${accents[accent]} flex items-center justify-center`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          {trend && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              {trend}
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-slate-400 mt-1">{label}</div>
        {sub && <div className="text-[11px] text-slate-500 mt-2">{sub}</div>}
      </CardContent>
    </Card>
  );
};

export default function SuperadminDashboard() {
  const navigate = useNavigate();
  const { session } = useSuperadminAuth();
  const { tenants, users, audit, guardrails, roles, locations, modulesCount, isLoading } =
    useScopedSuperadminData();

  const persona = session?.persona ?? "platform";

  const platformSummary = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: fetchDashboardSummary,
    enabled: persona === "platform",
    staleTime: 30_000,
  });

  const platformActivity = useQuery({
    queryKey: ["dashboard", "recent-activity"],
    queryFn: () => fetchRecentActivity(6),
    enabled: persona === "platform",
    staleTime: 30_000,
  });

  const platformHealth = useQuery({
    queryKey: ["dashboard", "platform-health"],
    queryFn: fetchPlatformHealth,
    enabled: persona === "platform",
    staleTime: 60_000,
  });

  const recentAudits =
    persona === "platform" && platformActivity.data?.length
      ? platformActivity.data
      : audit.slice(0, 6);

  const totalStores =
    persona === "platform" && platformSummary.data
      ? platformSummary.data.totalStores
      : persona === "platform"
        ? tenants.reduce((s, t) => s + t.storesCount, 0)
        : locations.filter((l) => l.type === "Store").length;

  const totalRevenue = tenants.reduce((s, t) => s + (t.monthlyRevenue ?? 0), 0);
  const pendingApprovals =
    persona === "platform" && platformSummary.data
      ? platformSummary.data.pendingApprovals
      : audit.filter((a) => a.result === "pending").length;
  const customRoles = roles.filter((r) => r.isCustom).length;
  const enabledModulesAvg = modulesCount;

  const personaTitle =
    persona === "platform"
      ? "Platform Overview"
      : persona === "organization"
        ? "Organization Overview"
        : "Workspace Overview";

  const headlineSub =
    persona === "platform"
      ? "Govern every tenant, module, role and approval rail across Ithina."
      : persona === "organization"
        ? `Manage users, roles, org tree and modules across ${session?.tenantName}.`
        : `Manage users and roles within your assigned scope at ${session?.tenantName}.`;

  const topTenants = [...tenants].sort((a, b) => b.usersCount - a.usersCount).slice(0, 5);

  const healthMessage =
    platformHealth.data?.message ?? "All systems operational";
  const healthOk = platformHealth.data?.status === "operational" || !platformHealth.data;

  if (isLoading && persona !== "platform") {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-slate-400 gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading workspace dashboard…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown className="h-5 w-5 text-[hsl(217,91%,75%)]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[hsl(217,91%,75%)] font-semibold">
              {personaTitle}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            {persona === "platform"
              ? "Superadmin Dashboard"
              : persona === "organization"
                ? `${session?.tenantName} — Admin Dashboard`
                : `${session?.tenantName} — Tenant Dashboard`}
          </h1>
          <p className="text-sm text-slate-400 mt-1">{headlineSub}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">
            {persona === "platform" ? "Platform health" : "Workspace health"}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div
              className={`h-2 w-2 rounded-full animate-pulse ${healthOk ? "bg-emerald-400" : "bg-amber-400"}`}
            />
            <span
              className={`text-sm font-medium ${healthOk ? "text-emerald-300" : "text-amber-300"}`}
            >
              {healthMessage}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {persona === "platform" && (
          <KPI
            label="Active tenants"
            value={
              platformSummary.data
                ? `${platformSummary.data.activeTenants} / ${platformSummary.data.totalTenants}`
                : `${tenants.filter((t) => t.status === "active").length} / ${tenants.length}`
            }
            sub="across the platform"
            icon={Building2}
            accent="blue"
          />
        )}
        {persona !== "platform" && (
          <KPI
            label="Your tenant"
            value={session?.tenantName ?? "—"}
            sub={tenants[0]?.tier ?? "—"}
            icon={Building2}
            accent="blue"
          />
        )}
        <KPI
          label={persona === "platform" ? "Platform users" : "Users in scope"}
          value={
            persona === "platform" && platformSummary.data
              ? platformSummary.data.totalUsers.toLocaleString()
              : users.length.toLocaleString()
          }
          sub={persona === "platform" ? "across all tenants" : "managed by you"}
          icon={Users}
          accent="purple"
        />
        <KPI
          label="Stores in scope"
          value={totalStores.toLocaleString()}
          sub={
            persona === "platform"
              ? `${tenants.length} tenants`
              : `${locations.filter((l) => l.type === "Region").length} regions`
          }
          icon={Store}
          accent="teal"
        />
        {persona === "platform" && (
          <KPI
            label="MRR"
            value={`$${((platformSummary.data?.monthlyRevenue ?? totalRevenue) / 1000).toFixed(1)}k`}
            sub="recurring"
            icon={DollarSign}
            accent="green"
            trend="+12.4%"
          />
        )}
        {persona !== "platform" && (
          <KPI
            label="Org nodes"
            value={locations.length}
            sub="HQ · regions · stores"
            icon={Server}
            accent="green"
          />
        )}
        <KPI
          label="Pending approvals"
          value={pendingApprovals}
          sub="in your audit log"
          icon={ShieldAlert}
          accent="amber"
        />
        <KPI
          label={persona === "platform" ? "Guardrails fired (24h)" : "Audit events"}
          value={
            persona === "platform" && platformSummary.data
              ? platformSummary.data.guardrailsTriggered24h
              : audit.length
          }
          sub={persona === "platform" ? "across guardrails" : "visible to you"}
          icon={Activity}
          accent="red"
        />
        <KPI
          label="Custom roles"
          value={
            persona === "platform" && platformSummary.data
              ? platformSummary.data.customRoles
              : customRoles
          }
          sub={`of ${persona === "platform" && platformSummary.data ? platformSummary.data.totalRoles : roles.length} total`}
          icon={Lock}
          accent="purple"
        />
        <KPI
          label="Modules"
          value={enabledModulesAvg}
          sub={persona === "platform" ? "deployed" : "enabled"}
          icon={Boxes}
          accent="teal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-white text-base">
              {persona === "platform" ? "Top tenants by users" : "Tenant snapshot"}
            </CardTitle>
            {persona === "platform" && (
              <button
                type="button"
                onClick={() => navigate("/superadmin/tenants")}
                className="text-xs text-[hsl(217,91%,75%)] hover:underline"
              >
                Manage all →
              </button>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            {topTenants.length === 0 && (
              <div className="text-sm text-slate-500 p-6 text-center">No tenant in scope.</div>
            )}
            {topTenants.map((t) => (
              <div
                key={t.id}
                onClick={() => persona === "platform" && navigate("/superadmin/tenants")}
                onKeyDown={(e) =>
                  persona === "platform" && e.key === "Enter" && navigate("/superadmin/tenants")
                }
                role={persona === "platform" ? "button" : undefined}
                tabIndex={persona === "platform" ? 0 : undefined}
                className={`flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 ${persona === "platform" ? "hover:bg-white/5 cursor-pointer" : ""} transition`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[hsl(217,91%,60%)]/30 to-[hsl(262,60%,55%)]/30 flex items-center justify-center text-white text-xs font-bold">
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {t.industry} · {t.country}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-white font-medium">
                      {t.usersCount.toLocaleString()} users
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {t.storesCount.toLocaleString()} stores
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-[hsl(217,91%,60%)]/30 text-[hsl(217,91%,75%)] text-[10px]"
                  >
                    {t.tier}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-white text-base">Recent activity</CardTitle>
            <button
              type="button"
              onClick={() => navigate("/superadmin/audit")}
              className="text-xs text-[hsl(217,91%,75%)] hover:underline"
            >
              Audit log →
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAudits.length === 0 && (
              <div className="text-sm text-slate-500 p-6 text-center">No activity in scope yet.</div>
            )}
            {recentAudits.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-2 text-xs border-b border-white/5 pb-2 last:border-0"
              >
                <div
                  className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                    a.result === "success"
                      ? "bg-emerald-400"
                      : a.result === "denied"
                        ? "bg-[hsl(4,84%,55%)]"
                        : "bg-amber-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-slate-200">
                    <span className="font-medium">{a.actor}</span>
                    <span className="text-slate-400"> · {a.action}</span>
                  </div>
                  <div className="text-slate-500 truncate">{a.resource}</div>
                  <div className="text-slate-600 mt-0.5">
                    {a.tenant} · {a.timestamp.split(" ")[1]}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Tenants", icon: Building2, route: "/superadmin/tenants", section: "tenants" as const },
          { label: "Manage roles", icon: ShieldAlert, route: "/superadmin/roles", section: "roles" as const },
          { label: "Module access", icon: Boxes, route: "/superadmin/modules", section: "modules" as const },
          { label: "Org tree", icon: Server, route: "/superadmin/organization", section: "organization" as const },
        ]
          .filter((q) =>
            persona === "platform"
              ? true
              : persona === "organization"
                ? q.section !== "tenants" || tenants.length > 1
                : ["roles", "organization"].includes(q.section),
          )
          .map((q) => (
            <button
              key={q.label}
              type="button"
              onClick={() => navigate(q.route)}
              className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[hsl(217,91%,60%)]/40 transition text-left flex items-center gap-3"
            >
              <div className="h-9 w-9 rounded-lg bg-[hsl(217,91%,60%)]/15 flex items-center justify-center">
                <q.icon className="h-4 w-4 text-[hsl(217,91%,75%)]" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">{q.label}</div>
                <div className="text-[11px] text-slate-400">Quick action</div>
              </div>
            </button>
          ))}
      </div>

      {guardrails.length > 0 && persona !== "tenant" && (
        <div className="text-[11px] text-slate-500">
          {guardrails.length} guardrail rule{guardrails.length === 1 ? "" : "s"} in your scope.
        </div>
      )}
    </div>
  );
}
