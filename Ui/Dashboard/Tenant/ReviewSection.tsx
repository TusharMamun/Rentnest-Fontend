"use client";

import { useState } from "react";
import { Star, Send, Loader2, CheckCircle2 } from "lucide-react";
import { submitReviewAction } from "@/src/actions/review.actions";
import { toast } from "sonner";
import type { RentalRequest } from "@/lib/type";

interface Props {
  reviewedRentals: RentalRequest[];
  pendingReview: RentalRequest[];
}

export default function ReviewSection({ reviewedRentals, pendingReview }: Props) {
  return (
    <div className="space-y-8">
      {/* Pending Reviews */}
      {pendingReview.length > 0 && (
        <section>
          <h2 className="font-bold text-slate-800 mb-4 text-base">Awaiting Your Review</h2>
          <div className="space-y-4">
            {pendingReview.map(r => <ReviewForm key={r.id} rental={r} />)}
          </div>
        </section>
      )}

      {/* Submitted Reviews */}
      {reviewedRentals.length > 0 && (
        <section>
          <h2 className="font-bold text-slate-800 mb-4 text-base">Your Reviews</h2>
          <div className="space-y-4">
            {reviewedRentals.map(r =>
              r.reviews?.map(rev => (
                <div key={rev.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-slate-900 text-sm">{r.property?.title ?? "Property"}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < rev.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}`} />
                      ))}
                    </div>
                  </div>
                  {rev.comment && <p className="text-sm text-slate-600 leading-relaxed">{rev.comment}</p>}
                  <p className="text-xs text-slate-400">{new Date(rev.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function ReviewForm({ rental }: { rental: RentalRequest }) {
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await submitReviewAction({ rentelid: rental.id, rating, comment: comment.trim() || undefined });
      if (!result?.success) throw new Error(result?.message || "Failed to submit review");
      toast.success("Review submitted!");
      setSubmitted(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-3">
        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
        <div>
          <p className="font-bold text-emerald-800 text-sm">Review submitted for {rental.property?.title}!</p>
          <p className="text-emerald-600 text-xs mt-0.5">Thank you for your feedback.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-slate-900 text-sm">{rental.property?.title ?? "Property"}</p>
          <p className="text-xs text-slate-500">{rental.property?.location}</p>
        </div>
        <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full font-semibold">Confirmed</span>
      </div>

      {/* Star Rating */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-600">Your Rating *</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} type="button"
              onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(star)}>
              <Star className={`w-7 h-7 transition-colors ${star <= (hovered || rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600">Comment (optional)</label>
        <textarea rows={3} value={comment} onChange={e => setComment(e.target.value)}
          placeholder="Share your experience with this property..."
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
      </div>

      <button type="submit" disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <><Send className="w-4 h-4" /> Submit Review</>}
      </button>
    </form>
  );
}
