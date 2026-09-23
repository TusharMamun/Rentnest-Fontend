"use server";

import { updateRentalRequestStatus } from "@/lib/api";

export async function approveRequestAction(id: string) {
  return updateRentalRequestStatus(id, "APPROVED");
}

export async function rejectRequestAction(id: string) {
  return updateRentalRequestStatus(id, "REJECTED");
}
