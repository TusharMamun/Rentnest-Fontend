// app/loading.tsx
import { Building2, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      {/* Animated Card Container */}
      <div className="relative flex flex-col items-center justify-center p-8 rounded-2xl bg-white border border-gray-100 shadow-2xl shadow-blue-500/10 max-w-xs w-full mx-4">
        
        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-2xl" />

        {/* Brand Icon with Pulsing Effect */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl animate-pulse" />
          <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 text-white">
            <Building2 className="w-8 h-8 animate-bounce" />
          </div>
        </div>

        {/* Brand Name & Title */}
        <h3 className="text-lg font-bold text-gray-800 tracking-tight mb-1">
          RentNest
        </h3>
        <p className="text-xs text-gray-400 font-medium mb-6">
          Loading your experience...
        </p>

        {/* Spinner & Progress Indicator */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-center gap-2 text-blue-600 text-xs font-semibold">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>Fetching properties...</span>
          </div>

          {/* Progress Bar Animation */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-progress" />
          </div>
        </div>

      </div>
    </div>
  );
}