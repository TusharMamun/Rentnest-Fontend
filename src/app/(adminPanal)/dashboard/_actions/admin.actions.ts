"use server";

import { adminUpdateUserStatus } from "@/lib/api";

export async function banUserAction(id: string) {
  return adminUpdateUserStatus(id, "BAN");
}

export async function unbanUserAction(id: string) {
  return adminUpdateUserStatus(id, "UNBAN");
}
