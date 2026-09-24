import { Suspense } from "react";
import { getMyRentalRequests } from "@/lib/api";
import type { RentalRequest } from "@/lib/type";
import { Star, Loader2 } from "lucide-react";
import ReviewSection from "@/Ui/Dashboard/Tenant/ReviewSection";

export const metadata = { title: "My Reviews | RentNest" };

export default function MyReviewsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" /> My Reviews
        </h1>
      </div>
      <Suspense fallback={<PageLoader />}>
        <ReviewsList />
      </Suspense>
    </div>
  );
}

async function ReviewsList() {
  const res = await getMyRentalRequests();
  const rentals: RentalRequest[] = res?.data ?? [];

  const confirmedRentals = rentals.filter((r) => r.status === "CONFIRMED");
  const reviewedRentals  = confirmedRentals.filter((r) => r.reviews && r.reviews.length > 0);
  const pendingReview    = confirmedRentals.filter((r) => !r.reviews || r.reviews.length === 0);

  if (confirmedRentals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 gap-4 text-center">
        <Star className="w-12 h-12 text-slate-200" />
        <h3 className="font-bold text-slate-600">No confirmed rentals yet</h3>
        <p className="text-slate-400 text-sm max-w-xs">Complete a rental and confirm payment to leave a review.</p>
      </div>
    );
  }

  return <ReviewSection reviewedRentals={reviewedRentals} pendingReview={pendingReview} />;
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24 text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}
