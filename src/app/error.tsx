'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log error to monitoring service (e.g., Sentry)
    console.error('App Error:', error)
  }, [error])

  const handleRetry = () => {
    // Refresh server components data then reset error boundary state
    router.refresh()
    reset()
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md p-8 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 text-center">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-rose-500 rounded-t-2xl" />

        {/* Warning Icon Badge */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-md shadow-red-500/10">
          <AlertTriangle className="h-7 w-7" />
        </div>

        {/* Heading & Subtitle */}
        <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-2">
          Something went wrong
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          An unexpected error occurred while loading this page. Please try again or return to the home page.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-center">
          <Button
            onClick={handleRetry}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs h-9 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-50 text-xs h-9 px-4 rounded-lg flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back Home</span>
          </Button>
        </div>

        {/* Optional Error Digest for debugging */}
        {error.digest && (
          <p className="mt-6 text-[10px] text-slate-400 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}