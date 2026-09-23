"use server";

import { createProperty, updateProperty, deleteProperty, imageUpload } from "@/lib/api";

export async function createPropertyAction(formData: FormData) {
  const title        = formData.get("title") as string;
  const description  = formData.get("description") as string;
  const location     = formData.get("location") as string;
  const pricePerMonth = Number(formData.get("pricePerMonth"));
  const categoryName = formData.get("categoryName") as string;
  const isAvailable  = (formData.get("isAvailable") as "AVAILABLE" | "NOT_AVAILABLE") ?? "AVAILABLE";
  const amenities    = JSON.parse((formData.get("amenities") as string) || "[]") as string[];
  const imageUrl     = formData.get("imageUrl") as string;

  if (!imageUrl) return { success: false, message: "Image URL is required" };

  return createProperty({ title, description, location, pricePerMonth, categoryName, isAvailable, amenities, image: imageUrl });
}

export async function updatePropertyAction(id: string, formData: FormData) {
  const title        = formData.get("title") as string;
  const description  = formData.get("description") as string;
  const location     = formData.get("location") as string;
  const pricePerMonth = Number(formData.get("pricePerMonth"));
  const categoryName = formData.get("categoryName") as string;
  const amenities    = JSON.parse((formData.get("amenities") as string) || "[]") as string[];
  const imageUrl     = formData.get("imageUrl") as string;

  return updateProperty(id, {
    title, description, location, pricePerMonth, categoryName, amenities,
    ...(imageUrl ? { image: imageUrl } : {}),
  });
}

export async function deletePropertyAction(id: string) {
  return deleteProperty(id);
}

export async function approveRequestAction(id: string) {
  const { updateRentalRequestStatus } = await import("@/lib/api");
  return updateRentalRequestStatus(id, "APPROVED");
}

export async function rejectRequestAction(id: string) {
  const { updateRentalRequestStatus } = await import("@/lib/api");
  return updateRentalRequestStatus(id, "REJECTED");
}
