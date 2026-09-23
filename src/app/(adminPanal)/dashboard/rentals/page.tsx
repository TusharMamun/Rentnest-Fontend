import { Suspense } from "react";
import { getMyRentalRequests } from "@/lib/api";
import type { RentalRequest } from "@/lib/type";
import { ClipboardList, Loader2 } from "lucide-react";
import RentalCard from "@/Ui/Dashboard/Tenant/RentalCard";

export const metadata = { title: "My Rentals | RentNest" };

export default function MyRentalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-blue-600" /> My Rental Requests
        </h1>
      </div>
      <Suspense fallback={<PageLoader />}>
        <RentalsList />
      </Suspense>
    </div>
  );
}

async function RentalsList() {
  const res = await getMyRentalRequests();
  const rentals: RentalRequest[] = res?.data ?? [];

  if (rentals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 gap-4 text-center">
        <ClipboardList className="w-12 h-12 text-slate-200" />
        <h3 className="font-bold text-slate-600">No rental requests yet</h3>
        <p className="text-slate-400 text-sm max-w-xs">Browse properties and submit a rental request to get started.</p>
        <a href="/properties" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors">
          Browse Properties
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rentals.map((r) => <RentalCard key={r.id} rental={r} />)}
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
