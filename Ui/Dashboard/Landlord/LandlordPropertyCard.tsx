"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, DollarSign, Trash2, Pencil, Loader2, CheckCircle2, XCircle, Building2 } from "lucide-react";
import { deletePropertyAction } from "@/src/actions/property.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Property } from "@/lib/type";

export default function LandlordPropertyCard({ property }: { property: Property }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deletePropertyAction(property.id);
      if (!result?.success) throw new Error(result?.message || "Failed to delete");
      toast.success("Property deleted.");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
        {property.image ? (
          <Image src={property.image} alt={property.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <Building2 className="w-10 h-10 text-blue-300" />
          </div>
        )}
        <span className={`absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full ${property.isAvailable === "AVAILABLE" ? "bg-emerald-500 text-white" : "bg-slate-600 text-white"}`}>
          {property.isAvailable === "AVAILABLE" ? "Available" : "Rented"}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        {property.catagory && <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{property.catagory.catagoryName}</span>}
        <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{property.title}</h3>
        <p className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3.5 h-3.5" />{property.location}</p>
        <div className="flex items-center gap-1 text-blue-600 font-bold text-sm mt-auto">
          <DollarSign className="w-4 h-4" />{property.pricePerMonth.toLocaleString()}<span className="text-xs text-slate-400 font-normal ml-1">/mo</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2 border-t border-slate-100 mt-1">
          <Link href={`/dashboard/landlord/editProperty/${property.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 text-xs font-semibold transition-colors">
            <Pencil className="w-3.5 h-3.5" /> Edit
          </Link>

          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:border-red-400 hover:text-red-600 text-xs font-semibold transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          ) : (
            <div className="flex-1 flex gap-1">
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors disabled:opacity-60">
                {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />} Yes
              </button>
              <button onClick={() => setConfirmDelete(false)}
                className="flex-1 flex items-center justify-center py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold">
                <XCircle className="w-3 h-3" /> No
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
