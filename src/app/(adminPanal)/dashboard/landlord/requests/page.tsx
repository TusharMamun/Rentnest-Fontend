import { Suspense } from "react";
import { getLandlordRentalRequests } from "@/lib/api";
import type { RentalRequest } from "@/lib/type";
import { ClipboardList, Loader2 } from "lucide-react";
import LandlordRequestCard from "@/Ui/Dashboard/Landlord/LandlordRequestCard";

export const metadata = { title: "Rental Requests | RentNest" };

export default function LandlordRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-blue-600" /> Rental Requests
        </h1>
      </div>
      <Suspense fallback={<PageLoader />}>
        <RequestsList />
      </Suspense>
    </div>
  );
}

async function RequestsList() {
  const res = await getLandlordRentalRequests();
  const requests: RentalRequest[] = res?.data ?? [];
  const pending = requests.filter((r) => r.status === "PENDING");
  const others = requests.filter((r) => r.status !== "PENDING");

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 gap-4 text-center">
        <ClipboardList className="w-12 h-12 text-slate-200" />
        <h3 className="font-bold text-slate-600">No requests yet</h3>
        <p className="text-slate-400 text-sm max-w-xs">Rental requests from tenants will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <section>
          <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Pending ({pending.length})
          </h2>
          <div className="space-y-3">{pending.map((r) => <LandlordRequestCard key={r.id} request={r} />)}</div>
        </section>
      )}
      {others.length > 0 && (
        <section>
          <h2 className="font-bold text-slate-800 mb-3">All Requests</h2>
          <div className="space-y-3">{others.map((r) => <LandlordRequestCard key={r.id} request={r} />)}</div>
        </section>
      )}
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24 text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}
