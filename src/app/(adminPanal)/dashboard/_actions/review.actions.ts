"use server";

import { createReview } from "@/lib/api";
import type { CreateReviewPayload } from "@/lib/type";

export async function submitReviewAction(payload: CreateReviewPayload) {
  return createReview(payload);
}
