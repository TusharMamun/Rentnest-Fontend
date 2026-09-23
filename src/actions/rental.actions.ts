"use server";

import { createRentalRequest, createCheckoutSession } from "@/lib/api";
import type { CreateRentalPayload } from "@/lib/type";

export async function createRentalAction(payload: CreateRentalPayload) {
  return createRentalRequest(payload);
}

export async function startCheckoutAction(requestId: string) {
  return createCheckoutSession(requestId);
}
