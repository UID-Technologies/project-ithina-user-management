import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSuperadminAuth } from "@/contexts/SuperadminAuthProvider";

export function RequireSuperadminAuth() {
  const { isAuthenticated, isLoading } = useSuperadminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(222,47%,9%)] text-slate-300 gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/superadmin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
