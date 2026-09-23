"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2, LogIn, DollarSign } from "lucide-react";
import { createRentalAction } from "@/src/actions/rental.actions";
import { toast } from "sonner";
import Link from "next/link";
import type { Property, User } from "@/lib/type";

interface Props {
  property: Property;
  user?: User | null;
}

export default function RentRequestForm({ property, user }: Props) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const isAvailable = property.isAvailable === "AVAILABLE";
  const isOwner = user?.id === property.landlordId;
  const canRent = user && user.role !== "LANDLORD" && !isOwner && isAvailable;

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) { toast.error("Please select both start and end dates"); return; }
    if (startDate >= endDate) { toast.error("End date must be after start date"); return; }
    setLoading(true);
    try {
      const result = await createRentalAction({ propertyId: property.id, startDate, endDate });
      if (!result?.success) throw new Error(result?.message || "Failed to submit request");
      toast.success("Rental request submitted! Awaiting landlord approval.");
      router.push("/dashboard/rentals");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-5">
      <div className="text-center pb-4 border-b border-slate-100">
        <div className="flex items-center justify-center gap-1 text-2xl font-extrabold text-blue-600">
          <DollarSign className="w-6 h-6" />{property.pricePerMonth.toLocaleString()}
        </div>
        <p className="text-xs text-slate-400 mt-1">per month</p>
      </div>

      {!isAvailable && (
        <div className="bg-slate-100 text-slate-600 text-sm text-center py-3 rounded-xl font-medium">
          This property is currently not available.
        </div>
      )}

      {!user && (
        <div className="text-center space-y-3">
          <p className="text-sm text-slate-600">Sign in to request this property.</p>
          <Link href={`/login`} className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors">
            <LogIn className="w-4 h-4" /> Sign In to Book
          </Link>
        </div>
      )}

      {user && user.role === "LANDLORD" && (
        <p className="text-sm text-slate-500 text-center bg-amber-50 border border-amber-100 rounded-xl py-3 px-4">
          Landlords cannot rent properties.
        </p>
      )}

      {isOwner && (
        <p className="text-sm text-slate-500 text-center bg-slate-50 border border-slate-100 rounded-xl py-3 px-4">
          This is your listing.
        </p>
      )}

      {canRent && isAvailable && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-blue-500" /> Move-in Date
            </label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} min={today} required
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-blue-500" /> Move-out Date
            </label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate || today} required
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Request to Rent"}
          </button>
          <p className="text-[11px] text-slate-400 text-center">No charge until landlord approves & you pay.</p>
        </form>
      )}
    </div>
  );
}
