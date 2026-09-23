import { Suspense } from "react";
import { adminGetAllProperties } from "@/lib/api";
import type { Property } from "@/lib/type";
import { Building2, MapPin, DollarSign, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Image from "next/image";

export const metadata = { title: "All Properties | RentNest" };

export default function AdminPropertiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" /> All Properties
        </h1>
      </div>
      <Suspense fallback={<PageLoader />}>
        <PropertiesList />
      </Suspense>
    </div>
  );
}

async function PropertiesList() {
  const res = await adminGetAllProperties();
  const properties: Property[] = res?.data ?? [];
  const available = properties.filter((p) => p.isAvailable === "AVAILABLE").length;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total",     value: properties.length,            bg: "bg-blue-50",    text: "text-blue-700" },
          { label: "Available", value: available,                    bg: "bg-emerald-50", text: "text-emerald-700" },
          { label: "Rented",    value: properties.length - available, bg: "bg-slate-100",  text: "text-slate-700" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-white`}>
            <p className={`text-2xl font-extrabold ${s.text}`}>{s.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 gap-4 text-center">
          <Building2 className="w-12 h-12 text-slate-200" />
          <h3 className="font-bold text-slate-600">No properties listed yet</h3>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Property</th>
                  <th className="py-3 px-5">Location</th>
                  <th className="py-3 px-5">Landlord</th>
                  <th className="py-3 px-5">Price</th>
                  <th className="py-3 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <Image src={p.image} alt={p.title} fill sizes="40px" className="object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm max-w-[200px] truncate">{p.title}</p>
                          {p.catagory && <p className="text-[10px] text-blue-600 font-semibold">{p.catagory.catagoryName}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5" />{p.location}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-xs text-slate-600">
                      {p.landlord?.name ?? "—"}<br />
                      <span className="text-slate-400">{p.landlord?.email}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="flex items-center gap-0.5 font-bold text-blue-600 text-sm">
                        <DollarSign className="w-3.5 h-3.5" />{p.pricePerMonth.toLocaleString()}
                        <span className="text-xs text-slate-400 font-normal">/mo</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${p.isAvailable === "AVAILABLE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                        {p.isAvailable === "AVAILABLE" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {p.isAvailable === "AVAILABLE" ? "Available" : "Rented"}
                      </span>
                    </td>
                  </tr>
                ))}
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
