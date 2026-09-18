import { Building2, Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/20 backdrop-blur-md">
      {/* Container Card */}
      <div className="relative flex flex-col items-center justify-center p-8 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xl shadow-blue-500/10 max-w-xs w-full mx-4 backdrop-blur-xl">
        
        {/* Top Brand Gradient Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-2xl" />

        {/* Animated Icon Glow Container */}
        <div className="relative mb-5 mt-2">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-lg opacity-40 animate-pulse" />
          <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-md shadow-blue-500/20 text-white">
            <Building2 className="w-7 h-7 animate-bounce" />
          </div>
        </div>

        {/* App Title */}
        <h3 className="text-base font-bold text-slate-800 tracking-tight mb-0.5">
          RentNest
        </h3>
        <p className="text-[11px] text-slate-500 font-medium mb-5">
          Preparing your portal...
        </p>

        {/* Indicator & Progress Bar */}
        <div className="w-full space-y-2.5">
          <div className="flex items-center justify-center gap-1.5 text-blue-600 text-xs font-semibold">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span>Loading...</span>
          </div>

          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full animate-pulse w-3/4" />
          </div>
        </div>

      </div>
    </div>
  );
}