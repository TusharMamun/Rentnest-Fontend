"use server";


import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";



const baseUrl = process.env.API_URL;

export const api = async (path: string, options: RequestInit = {}) => {
  if (!baseUrl) {
    throw new Error("API_URL is not defined");
  }

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!res.ok) {
      return { success: false };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

export const imageUpload = async (imageData: File) => {
  try {
    const formData = new FormData();
    formData.append("image", imageData);

    const apiKey =
      process.env.IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    const response = await fetch(
      `https://api.imgbb.com/1/upload?expiration=600&key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Image upload failed");
    }

    const result = await response.json();
    return result.data.url;
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
};

export const getMe = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "user Not logdin",
    };
  }

  const res = await fetch(`${baseUrl}/api/auth/me`, {
    headers: {
      cookie: `accessToken=${accessToken}`,
    },
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 24,
      tags: ["me"],
    },
  });

  const result = await res.json();
  return result;
};









export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  // In Next.js 15, revalidateTag accepts "max" as the second argument
  revalidateTag("me", "max");
};