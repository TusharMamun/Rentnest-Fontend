import Link from "next/link";
import { CheckCircle2, Home, ClipboardList } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payment Successful | RentNest" };

export default function SuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-10">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Payment Successful!</h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Your rental payment was processed successfully. Your rental is now confirmed — welcome to your new home!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/rentals"
            className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors">
            <ClipboardList className="w-4 h-4" /> My Rentals
          </Link>
          <Link href="/"
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm border border-slate-200 transition-colors">
            <Home className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
