"use server";

import { cookies } from "next/headers";

const baseUrl = process.env.API_URL;

export const refreshApi = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return {
      success: false,
      message: "Refresh token not found",
    };
  }

  try {
    const res = await fetch(`${baseUrl}/api/auth/refresh-token`, {
      method: "POST", // Token refresh endpoints are typically POST
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-store", // Always fetch fresh data for token updates
    });

    const result = await res.json();


    return result;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return {
      success: false,
      message: "Failed to refresh authentication session",
    };
  }
};