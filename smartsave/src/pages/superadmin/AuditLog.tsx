import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, ScrollText, Loader2 } from "lucide-react";
import { useAuditLogs } from "@/hooks/useAuditApi";
import { useSuperadminAuth } from "@/contexts/SuperadminAuthProvider";
import { ApiError } from "@/lib/api/types";

const resultStyle: Record<string, string> = {
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  denied: "bg-[hsl(4,84%,55%)]/15 text-[hsl(4,84%,75%)] border-[hsl(4,84%,55%)]/30",
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

export default function AuditLog() {
  const { session } = useSuperadminAuth();
  const [q, setQ] = useState("");
  const [result, setResult] = useState<"all" | "success" | "denied" | "pending">("all");
  const [debouncedQ, setDebouncedQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const { data: audit = [], isLoading, isError, error, refetch } = useAuditLogs({
    search: debouncedQ || undefined,
    result: result === "all" ? undefined : result,
    tenant: session?.persona !== "platform" ? session?.tenantName : undefined,
    limit: 500,
  });

  const exportCsv = () => {
    const header = ["timestamp", "actor", "actorRole", "tenant", "action", "resource", "scope", "result", "ip"];
    const rows = audit.map((a) =>
      header.map((h) => `"${String((a as Record<string, unknown>)[h] ?? "").toString().replace(/"/g, '""')}"`).join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-log-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Audit Log</h1>
          <p className="text-sm text-slate-400 mt-1">
            Immutable record of every user, role, permission, module, and override action across the platform.
          </p>
        </div>
        <Button
          onClick={exportCsv}
          variant="outline"
          disabled={audit.length === 0}
          className="bg-transparent border-white/20 text-white hover:bg-white/5"
        >
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search actor, action, resource…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-slate-200"
          />
        </div>
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
          {(["all", "success", "denied", "pending"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setResult(r)}
              className={`px-3 py-1 text-xs rounded capitalize ${result === r ? "bg-[hsl(217,91%,60%)] text-white" : "text-slate-400 hover:text-white"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {isError && (
        <div className="text-sm text-[hsl(4,84%,75%)]">
          {error instanceof ApiError ? error.message : "Failed to load audit logs."}{" "}
          <button type="button" onClick={() => refetch()} className="underline">
            Retry
          </button>
        </div>
      )}

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading audit log…
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Timestamp</th>
                  <th className="text-left px-4 py-3 font-medium">Actor</th>
                  <th className="text-left px-4 py-3 font-medium">Tenant</th>
                  <th className="text-left px-4 py-3 font-medium">Action</th>
                  <th className="text-left px-4 py-3 font-medium">Resource</th>
                  <th className="text-left px-4 py-3 font-medium">Scope</th>
                  <th className="text-left px-4 py-3 font-medium">Result</th>
                  <th className="text-left px-4 py-3 font-medium">IP</th>
                </tr>
              </thead>
              <tbody>
                {audit.map((a) => (
                  <tr key={a.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="px-4 py-3 text-slate-400 text-xs font-mono">{a.timestamp}</td>
                    <td className="px-4 py-3">
                      <div className="text-white">{a.actor}</div>
                      <div className="text-[11px] text-slate-500">{a.actorRole}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{a.tenant}</td>
                    <td className="px-4 py-3 text-slate-200">{a.action}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{a.resource}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[10px] border-white/10 text-slate-400 bg-white/5">
                        {a.scope}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={resultStyle[a.result]}>{a.result}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs font-mono">{a.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isLoading && audit.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <ScrollText className="h-10 w-10 mx-auto mb-2 opacity-30" />
              No audit entries match your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
