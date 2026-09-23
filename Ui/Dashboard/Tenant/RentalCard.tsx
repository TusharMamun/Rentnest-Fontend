"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, CalendarDays, DollarSign, CreditCard, Loader2, CheckCircle2, Clock, XCircle, Building2 } from "lucide-react";
import { startCheckoutAction } from "@/src/actions/rental.actions";
import { toast } from "sonner";
import type { RentalRequest } from "@/lib/type";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING:   { label: "Pending",   color: "bg-amber-50 text-amber-700 ring-amber-600/20",   icon: Clock },
  APPROVED:  { label: "Approved",  color: "bg-blue-50 text-blue-700 ring-blue-600/20",      icon: CheckCircle2 },
  CONFIRMED: { label: "Confirmed", color: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", icon: CheckCircle2 },
  REJECTED:  { label: "Rejected",  color: "bg-red-50 text-red-700 ring-red-600/20",         icon: XCircle },
};

export default function RentalCard({ rental }: { rental: RentalRequest }) {
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const cfg = statusConfig[rental.status] ?? statusConfig.PENDING;
  const Icon = cfg.icon;

  const canPay =
    rental.status === "APPROVED" &&
    (!rental.subscriptions || rental.subscriptions.status !== "COMPLETED");

  const handlePay = async () => {
    setPaying(true);
    try {
      const result = await startCheckoutAction(rental.id);
      if (!result?.success || !result?.data?.checkOutUrl) throw new Error(result?.message || "Failed to start checkout");
      router.push(result.data.checkOutUrl);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
      setPaying(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Property Image */}
        {rental.property && (
          <div className="relative w-full sm:w-36 h-40 sm:h-auto shrink-0 bg-slate-100">
            {rental.property.image ? (
              <Image src={rental.property.image} alt={rental.property.title} fill sizes="144px" className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <Building2 className="w-8 h-8 text-blue-300" />
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-5 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              {rental.property ? (
                <Link href={`/properties/${rental.propertyId}`}
                  className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-base line-clamp-1">
                  {rental.property.title}
                </Link>
              ) : (
                <div className="flex items-center gap-1 font-bold text-slate-500"><Building2 className="w-4 h-4" /> Property</div>
              )}
              {rental.property && (
                <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />{rental.property.location}
                </p>
              )}
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${cfg.color}`}>
              <Icon className="w-3 h-3" />{cfg.label}
            </span>
          </div>

          {/* Dates & Price */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
              {new Date(rental.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              &nbsp;→&nbsp;
              {new Date(rental.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1 font-semibold text-blue-600">
              <DollarSign className="w-3.5 h-3.5" />{rental.totalPrice.toLocaleString()}/mo
            </span>
          </div>

          {/* Payment status badge */}
          {rental.subscriptions && (
            <p className="text-xs text-slate-500">
              Payment:{" "}
              <span className={`font-semibold ${rental.subscriptions.status === "COMPLETED" ? "text-emerald-600" : rental.subscriptions.status === "FAILED" ? "text-red-500" : "text-amber-600"}`}>
                {rental.subscriptions.status}
              </span>
            </p>
          )}

          {/* Pay Button */}
          {canPay && (
            <button onClick={handlePay} disabled={paying}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-60">
              {paying ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Redirecting…</> : <><CreditCard className="w-3.5 h-3.5" /> Pay Now</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
