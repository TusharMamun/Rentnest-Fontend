"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, DollarSign, User, MapPin, CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";
import { approveRequestAction, rejectRequestAction } from "@/src/actions/property.actions";
import { toast } from "sonner";
import type { RentalRequest } from "@/lib/type";

const statusColors: Record<string, string> = {
  PENDING:   "bg-amber-50 text-amber-700 ring-amber-600/20",
  APPROVED:  "bg-blue-50 text-blue-700 ring-blue-600/20",
  CONFIRMED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  REJECTED:  "bg-red-50 text-red-700 ring-red-600/20",
};

export default function LandlordRequestCard({ request }: { request: RentalRequest }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  const handle = async (action: "approve" | "reject") => {
    setLoading(action);
    try {
      const result = action === "approve" ? await approveRequestAction(request.id) : await rejectRequestAction(request.id);
      if (!result?.success) throw new Error(result?.message || `Failed to ${action}`);
      toast.success(`Request ${action === "approve" ? "approved" : "rejected"}!`);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-0.5">
          <p className="font-bold text-slate-900 text-sm">{request.property?.title ?? "Property"}</p>
          {request.property && (
            <p className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3.5 h-3.5" />{request.property.location}</p>
          )}
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${statusColors[request.status] ?? statusColors.PENDING}`}>
          {request.status === "PENDING" && <Clock className="w-3 h-3" />}
          {(request.status === "APPROVED" || request.status === "CONFIRMED") && <CheckCircle2 className="w-3 h-3" />}
          {request.status === "REJECTED" && <XCircle className="w-3 h-3" />}
          {request.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-600">
        {request.tenant && (
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-semibold">{request.tenant.name}</span>
            <span className="text-slate-400">({request.tenant.email})</span>
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
          {new Date(request.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          &nbsp;→&nbsp;
          {new Date(request.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
        <span className="flex items-center gap-1 font-semibold text-blue-600">
          <DollarSign className="w-3.5 h-3.5" />{request.totalPrice.toLocaleString()}/mo
        </span>
      </div>

      {request.status === "PENDING" && (
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <button onClick={() => handle("approve")} disabled={!!loading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors disabled:opacity-60">
            {loading === "approve" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />} Approve
          </button>
          <button onClick={() => handle("reject")} disabled={!!loading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors disabled:opacity-60">
            {loading === "reject" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />} Reject
          </button>
        </div>
      )}
    </div>
  );
}
