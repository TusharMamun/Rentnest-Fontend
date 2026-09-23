import { Suspense } from "react";
import { adminGetAllRentals } from "@/lib/api";
import type { RentalRequest } from "@/lib/type";
import { ClipboardList, CalendarDays, DollarSign, Loader2 } from "lucide-react";

export const metadata = { title: "All Rentals | RentNest" };

export default function AdminRentalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-blue-600" /> All Rental Requests
        </h1>
      </div>
      <Suspense fallback={<PageLoader />}>
        <RentalsList />
      </Suspense>
    </div>
  );
}

const statusConfig: Record<string, { color: string; dot: string }> = {
  PENDING:   { color: "bg-amber-50 text-amber-700 ring-amber-600/20",      dot: "bg-amber-400" },
  APPROVED:  { color: "bg-blue-50 text-blue-700 ring-blue-600/20",         dot: "bg-blue-500" },
  CONFIRMED: { color: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" },
  REJECTED:  { color: "bg-red-50 text-red-700 ring-red-600/20",            dot: "bg-red-500" },
};

async function RentalsList() {
  const res = await adminGetAllRentals();
  const rentals: RentalRequest[] = res?.data ?? [];

  const counts = {
    PENDING:   rentals.filter((r) => r.status === "PENDING").length,
    APPROVED:  rentals.filter((r) => r.status === "APPROVED").length,
    CONFIRMED: rentals.filter((r) => r.status === "CONFIRMED").length,
    REJECTED:  rentals.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(Object.entries(counts) as [string, number][]).map(([status, count]) => {
          const cfg = statusConfig[status];
          return (
            <div key={status} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${cfg.dot}`} />
              <div>
                <p className="text-xl font-extrabold text-slate-900">{count}</p>
                <p className="text-xs text-slate-400 font-medium capitalize">{status.toLowerCase()}</p>
              </div>
            </div>
          );
        })}
      </div>

      {rentals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 gap-4 text-center">
          <ClipboardList className="w-12 h-12 text-slate-200" />
          <h3 className="font-bold text-slate-600">No rental requests yet</h3>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Property</th>
                  <th className="py-3 px-5">Tenant</th>
                  <th className="py-3 px-5">Dates</th>
                  <th className="py-3 px-5">Price</th>
                  <th className="py-3 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {rentals.map((r) => {
                  const cfg = statusConfig[r.status] ?? statusConfig.PENDING;
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-5">
                        <p className="font-semibold text-slate-800 max-w-[160px] truncate">{r.property?.title ?? "—"}</p>
                        <p className="text-xs text-slate-400">{r.property?.location}</p>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {r.tenant?.name?.charAt(0) ?? "?"}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{r.tenant?.name ?? "—"}</p>
                            <p className="text-[10px] text-slate-400">{r.tenant?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3 text-blue-400" />
                          {new Date(r.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          &nbsp;–&nbsp;
                          {new Date(r.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="flex items-center gap-0.5 font-bold text-blue-600 text-sm">
                          <DollarSign className="w-3.5 h-3.5" />{r.totalPrice.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 ring-inset ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
