import Link from "next/link";
import { XCircle, RefreshCw, Home } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payment Cancelled | RentNest" };

export default function CancelPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-10">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Payment Cancelled</h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Your payment was not completed. No charges were made. You can try again from your rental requests page.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/rentals"
            className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors">
            <RefreshCw className="w-4 h-4" /> Try Again
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
