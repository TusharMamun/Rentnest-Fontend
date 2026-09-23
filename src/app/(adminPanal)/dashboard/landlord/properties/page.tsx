import { Suspense } from "react";
import { getLandlordProperties } from "@/lib/api";
import type { Property } from "@/lib/type";
import { Building2, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import LandlordPropertyCard from "@/Ui/Dashboard/Landlord/LandlordPropertyCard";

export const metadata = { title: "My Properties | RentNest" };

export default function LandlordPropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" /> My Properties
          </h1>
        </div>
        <Link
          href="/dashboard/landlord/createProperty"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors shadow"
        >
          <Plus className="w-4 h-4" /> Add Property
        </Link>
      </div>
      <Suspense fallback={<PageLoader />}>
        <PropertiesList />
      </Suspense>
    </div>
  );
}

async function PropertiesList() {
  const res = await getLandlordProperties();
  const properties: Property[] = res?.data ?? [];

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 gap-4 text-center">
        <Building2 className="w-12 h-12 text-slate-200" />
        <h3 className="font-bold text-slate-600">No properties yet</h3>
        <p className="text-slate-400 text-sm max-w-xs">Create your first listing to start receiving rental requests.</p>
        <Link href="/dashboard/landlord/createProperty" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors">
          Create Property
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {properties.map((p) => <LandlordPropertyCard key={p.id} property={p} />)}
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
