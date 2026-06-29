import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { GuardrailRule } from "@/data/superadminData";
import { GitBranch, Plus, Clock, ShieldCheck, Zap, MoreVertical, Pencil, Trash2, Loader2 } from "lucide-react";
import { GuardrailFormDialog } from "@/components/superadmin/GuardrailFormDialog";
import { ConfirmDeleteDialog } from "@/components/superadmin/ConfirmDeleteDialog";
import {
  useGuardrailRules,
  useGuardrailEvents24h,
  useUpdateGuardrail,
  useDeleteGuardrail,
} from "@/hooks/useGuardrailsApi";
import { useRoles } from "@/hooks/useRolesApi";
import { useModules } from "@/hooks/useModuleAccessApi";
import { ApiError } from "@/lib/api/types";
import { toast } from "sonner";
import { usePersonaGuard } from "@/hooks/usePersonaGuard";

export default function GuardrailsPanel() {
  usePersonaGuard("guardrails");
  const { data: guardrails = [], isLoading, isError, error, refetch } = useGuardrailRules();
  const { data: events24h = 0, isLoading: eventsLoading } = useGuardrailEvents24h();
  const { data: roles = [] } = useRoles();
  const { data: modules = [] } = useModules();
  const updateGuardrail = useUpdateGuardrail();
  const deleteGuardrail = useDeleteGuardrail();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<GuardrailRule | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<GuardrailRule | null>(null);

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (g: GuardrailRule) => { setEditing(g); setFormOpen(true); };

  const handleStatusToggle = async (g: GuardrailRule, active: boolean) => {
    try {
      await updateGuardrail.mutateAsync({
        id: g.id,
        payload: { status: active ? "active" : "draft" },
      });
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Failed to update guardrail status");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteGuardrail.mutateAsync(confirmDelete.id);
      toast.success(`Guardrail "${confirmDelete.name}" deleted`);
      setConfirmDelete(null);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Failed to delete guardrail");
    }
  };

  const activeCount = guardrails.filter((g) => g.status === "active").length;
  const avgEscalation = guardrails.length
    ? Math.round(guardrails.reduce((s, g) => s + g.escalateAfterHours, 0) / guardrails.length)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Guardrails & Approvals</h1>
          <p className="text-sm text-slate-400 mt-1">
            Define approver workflows, escalation timers, and override authority for high-impact actions.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white">
          <Plus className="h-4 w-4 mr-2" /> New guardrail
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Stat icon={ShieldCheck} label="Active rules" value={isLoading ? "—" : activeCount} accent="emerald" />
        <Stat icon={Clock} label="Avg escalation" value={isLoading ? "—" : avgEscalation != null ? `${avgEscalation}h` : "—"} accent="blue" />
        <Stat icon={Zap} label="Triggered (24h)" value={eventsLoading ? "—" : events24h} accent="amber" />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading guardrails…
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-[hsl(4,84%,55%)]/30 bg-[hsl(4,84%,55%)]/10 p-4 text-center">
          <p className="text-[hsl(4,84%,75%)]">
            {error instanceof ApiError ? error.message : "Failed to load guardrails"}
          </p>
          <Button variant="outline" onClick={() => refetch()} className="mt-3 bg-transparent border-white/20 text-white">
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-3">
          {guardrails.map((g) => {
            const m = modules.find((mm) => mm.key === g.module);
            const overrideRole = roles.find((r) => r.id === g.overrideRoleId);
            return (
              <Card key={g.id} className="bg-white/5 border-white/10">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-[hsl(262,60%,55%)]/15 flex items-center justify-center">
                        <GitBranch className="h-5 w-5 text-[hsl(262,60%,75%)]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-white">{g.name}</h3>
                          <Badge variant="outline" className="text-[10px] border-white/10 text-slate-300 bg-white/5">{m?.name}</Badge>
                          <Badge variant="outline" className={
                            g.status === "active"
                              ? "text-[10px] bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                              : "text-[10px] bg-amber-500/15 text-amber-300 border-amber-500/30"
                          }>{g.status}</Badge>
                        </div>
                        <div className="text-sm text-slate-300">
                          <span className="text-slate-500">Trigger:</span> {g.trigger}
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Approvers</div>
                            <div className="flex flex-wrap gap-1">
                              {g.approvers.map((rid) => (
                                <span key={rid} className="text-[10px] px-2 py-0.5 rounded bg-[hsl(217,91%,60%)]/15 text-[hsl(217,91%,75%)] border border-[hsl(217,91%,60%)]/20">
                                  {roles.find((r) => r.id === rid)?.name ?? rid}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Escalate after</div>
                            <div className="text-sm text-white flex items-center gap-1"><Clock className="h-3 w-3 text-slate-500" />{g.escalateAfterHours}h</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Override authority</div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[hsl(4,84%,55%)]/15 text-[hsl(4,84%,75%)] border border-[hsl(4,84%,55%)]/20">
                              {overrideRole?.name ?? "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={g.status === "active"}
                        disabled={updateGuardrail.isPending}
                        onCheckedChange={(v) => handleStatusToggle(g, v)}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-slate-500 hover:text-white p-1"><MoreVertical className="h-4 w-4" /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200">
                          <DropdownMenuItem onClick={() => openEdit(g)} className="cursor-pointer"><Pencil className="h-3.5 w-3.5 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem onClick={() => setConfirmDelete(g)} className="cursor-pointer text-[hsl(4,84%,75%)] focus:text-[hsl(4,84%,75%)]"><Trash2 className="h-3.5 w-3.5 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {guardrails.length === 0 && (
            <div className="text-center text-sm text-slate-500 p-12 border border-dashed border-white/10 rounded">
              No guardrails defined yet. Create your first one to enforce approval workflows.
            </div>
          )}
        </div>
      )}

      <GuardrailFormDialog open={formOpen} onOpenChange={setFormOpen} rule={editing} />
      <ConfirmDeleteDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title={`Delete guardrail "${confirmDelete?.name}"?`}
        description="This guardrail and its approval workflow will no longer apply. Existing pending approvals will be voided."
        onConfirm={handleDelete}
      />
    </div>
  );
}

const Stat = ({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; accent: string }) => {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-500/15 text-emerald-300",
    blue: "bg-[hsl(217,91%,60%)]/15 text-[hsl(217,91%,75%)]",
    amber: "bg-amber-500/15 text-amber-300",
  };
  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colors[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-xs text-slate-400">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
};
