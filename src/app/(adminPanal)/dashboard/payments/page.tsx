import { Suspense } from "react";
import { getMyPayments } from "@/lib/api";
import type { Subscription } from "@/lib/type";
import { CreditCard, CheckCircle2, Clock, XCircle, DollarSign, Loader2 } from "lucide-react";

export const metadata = { title: "Payment History | RentNest" };

export default function PaymentHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-blue-600" /> Payment History
        </h1>
      </div>
      <Suspense fallback={<PageLoader />}>
        <PaymentsList />
      </Suspense>
    </div>
  );
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  COMPLETED: { label: "Completed", color: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", icon: CheckCircle2 },
  PENDING:   { label: "Pending",   color: "bg-amber-50 text-amber-700 ring-amber-600/20",       icon: Clock },
  FAILED:    { label: "Failed",    color: "bg-red-50 text-red-700 ring-red-600/20",             icon: XCircle },
};

async function PaymentsList() {
  const res = await getMyPayments();
  const payments: Subscription[] = res?.data ?? [];
  const totalPaid = payments.filter((p) => p.status === "COMPLETED").reduce((s, p) => s + p.totalAmount, 0);

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 gap-4 text-center">
        <CreditCard className="w-12 h-12 text-slate-200" />
        <h3 className="font-bold text-slate-600">No payments yet</h3>
        <p className="text-slate-400 text-sm max-w-xs">Complete a rental request and pay via Stripe to see your history here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Paid", value: `$${totalPaid.toLocaleString()}`, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Completed",  value: payments.filter((p) => p.status === "COMPLETED").length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pending",    value: payments.filter((p) => p.status === "PENDING").length,   color: "text-amber-600", bg: "bg-amber-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <DollarSign className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Transaction ID</th>
                <th className="py-3 px-5">Amount</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {payments.map((p) => {
                const cfg = statusConfig[p.status] ?? statusConfig.PENDING;
                const Icon = cfg.icon;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5">
                      <p className="font-semibold text-slate-800 truncate max-w-[180px]">{p.trasectionId ?? "—"}</p>
                      <p className="text-xs text-slate-400 font-mono">{p.id.slice(0, 8)}…</p>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">${p.totalAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${cfg.color}`}>
                        <Icon className="w-3 h-3" />{cfg.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 text-xs">
                      {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24 text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}
