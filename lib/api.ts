"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import type {
  Property,
  RentalRequest,
  Subscription,
  Review,
  User,
  Category,
  CreatePropertyPayload,
  CreateRentalPayload,
  CreateReviewPayload,
  ApiResponse,
} from "./type";

const baseUrl = process.env.API_URL;

// ─── Base fetch wrapper ───────────────────────────────────────────────────────
export const api = async (path: string, options: RequestInit = {}) => {
  if (!baseUrl) throw new Error("API_URL is not defined");
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, message: errData?.message || "Request failed" };
    }
    return await res.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// ─── Authenticated fetch (reads cookie from Next.js cookie store) ─────────────
export const authApi = async (path: string, options: RequestInit = {}) => {
  if (!baseUrl) throw new Error("API_URL is not defined");
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { cookie: `accessToken=${accessToken}` } : {}),
      },
      ...options,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, message: errData?.message || "Request failed" };
    }
    return await res.json();
  } catch (error) {
    console.error("Auth API request failed:", error);
    throw error;
  }
};

// ─── Image Upload (ImgBB) ─────────────────────────────────────────────────────
export const imageUpload = async (imageData: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", imageData);
  const apiKey = process.env.IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  const response = await fetch(
    `https://api.imgbb.com/1/upload?expiration=600&key=${apiKey}`,
    { method: "POST", body: formData }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Image upload failed");
  }
  const result = await response.json();
  return result.data.url as string;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const getMe = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) return { success: false, message: "Not logged in" };
  const res = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { cookie: `accessToken=${accessToken}` },
    cache: "force-cache",
    next: { revalidate: 60 * 60 * 24, tags: ["me"] },
  });
  return await res.json();
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  revalidateTag("me", "max");
};

// ─── Public Properties ────────────────────────────────────────────────────────
export const getPublicProperties = async (params?: {
  searchTerm?: string;
  location?: string;
  catagoyName?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string;
}): Promise<ApiResponse<Property[]>> => {
  const query = new URLSearchParams();
  if (params?.searchTerm) query.set("searchTerm", params.searchTerm);
  if (params?.location) query.set("location", params.location);
  if (params?.catagoyName) query.set("catagoyName", params.catagoyName);
  if (params?.minPrice !== undefined) query.set("minPrice", String(params.minPrice));
  if (params?.maxPrice !== undefined) query.set("maxPrice", String(params.maxPrice));
  if (params?.amenities) query.set("amenities", params.amenities);
  const qs = query.toString();
  return api(`/api/properties${qs ? `?${qs}` : ""}`, {
    next: { revalidate: 60, tags: ["properties"] },
  });
};

export const getPublicPropertyById = async (id: string): Promise<ApiResponse<Property>> => {
  return api(`/api/properties/${id}`, {
    next: { revalidate: 60, tags: [`property-${id}`] },
  });
};

export const getPublicCategories = async (): Promise<ApiResponse<Category[]>> => {
  return api("/api/categories", {
    next: { revalidate: 60 * 60, tags: ["categories"] },
  });
};

// ─── Landlord: Properties ─────────────────────────────────────────────────────
export const getLandlordProperties = async (): Promise<ApiResponse<Property[]>> => {
  return authApi("/api/landlord/properties", {
    next: { revalidate: 0, tags: ["landlord-properties"] },
  });
};

export const createProperty = async (payload: CreatePropertyPayload) => {
  const result = await authApi("/api/landlord/properties", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  revalidateTag("landlord-properties", "max");
  revalidateTag("properties", "max");
  return result;
};

export const updateProperty = async (id: string, payload: Partial<CreatePropertyPayload>) => {
  const result = await authApi(`/api/landlord/properties/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  revalidateTag("landlord-properties", "max");
  revalidateTag("properties", "max");
  revalidateTag(`property-${id}`, "max");
  return result;
};

export const deleteProperty = async (id: string) => {
  const result = await authApi(`/api/landlord/properties/${id}`, {
    method: "DELETE",
  });
  revalidateTag("landlord-properties", "max");
  revalidateTag("properties", "max");
  return result;
};

export const getLandlordCategories = async (): Promise<ApiResponse<Category[]>> => {
  return authApi("/api/landlord/categories", {
    next: { revalidate: 60 * 60, tags: ["categories"] },
  });
};

// ─── Landlord: Rental Requests ────────────────────────────────────────────────
export const getLandlordRentalRequests = async (): Promise<ApiResponse<RentalRequest[]>> => {
  return authApi("/api/landlord/requests", {
    next: { revalidate: 0, tags: ["landlord-requests"] },
  });
};

export const updateRentalRequestStatus = async (
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
) => {
  const result = await authApi(`/api/landlord/requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  revalidateTag("landlord-requests", "max");
  revalidateTag("rentals", "max");
  return result;
};

// ─── Tenant: Rental Requests ──────────────────────────────────────────────────
export const createRentalRequest = async (payload: CreateRentalPayload) => {
  const result = await authApi("/api/rentals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  revalidateTag("rentals", "max");
  return result;
};

export const getMyRentalRequests = async (): Promise<ApiResponse<RentalRequest[]>> => {
  return authApi("/api/rentals/my", {
    next: { revalidate: 0, tags: ["rentals"] },
  });
};

// ─── Payments ────────────────────────────────────────────────────────────────
export const createCheckoutSession = async (requestId: string) => {
  return authApi("/api/payments/checkout", {
    method: "POST",
    body: JSON.stringify({ requestId }),
  });
};

export const getMyPayments = async (): Promise<ApiResponse<Subscription[]>> => {
  return authApi("/api/payments/getAllpaymnet", {
    next: { revalidate: 0, tags: ["payments"] },
  });
};

// ─── Reviews ─────────────────────────────────────────────────────────────────
export const createReview = async (payload: CreateReviewPayload) => {
  const result = await authApi("/api/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  revalidateTag("reviews", "max");
  return result;
};

export const getMyReviews = async (): Promise<ApiResponse<Review[]>> => {
  // Reviews come embedded in rental requests; fetch from there
  const requests = await authApi("/api/rentals/my", {
    next: { revalidate: 0, tags: ["reviews"] },
  });
  return requests;
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminGetAllUsers = async (): Promise<ApiResponse<User[]>> => {
  return authApi("/api/admin/users", {
    next: { revalidate: 0, tags: ["admin-users"] },
  });
};

export const adminUpdateUserStatus = async (id: string, userStatus: "BAN" | "UNBAN") => {
  const result = await authApi(`/api/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ userStatus }),
  });
  revalidateTag("admin-users", "max");
  return result;
};

export const adminGetAllProperties = async (): Promise<ApiResponse<Property[]>> => {
  return authApi("/api/admin/properties", {
    next: { revalidate: 0, tags: ["admin-properties"] },
  });
};

export const adminGetAllRentals = async (): Promise<ApiResponse<RentalRequest[]>> => {
  return authApi("/api/admin/rentals", {
    next: { revalidate: 0, tags: ["admin-rentals"] },
  });
};

export const adminGetAllPayments = async (): Promise<ApiResponse<Subscription[]>> => {
  return authApi("/api/payments/getAllpaymnet", {
    next: { revalidate: 0, tags: ["admin-payments"] },
  });
};
