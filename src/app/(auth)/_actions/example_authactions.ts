"use server";

import { api } from "@/lib/api";
import { IULoging, RegistrationPayload } from "@/lib/type";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
// Centralized helper to set authentication cookies
const setCookies = async ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) => {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 1 day
    path: "/",
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
};

export const loginAction = async (payload: IULoging) => {
  const { email, password } = payload;

  try {
    const res = await api("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res?.success) {
      return {
        success: false,
        message:
          res?.data?.message ||
          res?.message ||
          "Login failed. Please check your credentials.",
      };
    }

    await setCookies({
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    });
    const decodedToken = jwt.decode(res.data.accessToken) as { exp: number } | null;


    return {
      success: true,
      data: res.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
};

export const registrationAction = async (payload: RegistrationPayload) => {
  try {
    // 1. Register the user
    const registerBody = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      bio: payload.bio,
      profilePhoto: payload.profilePhoto,
    };

    const res = await api("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerBody),
    });

    if (!res?.success) {
      return {
        success: false,
        error: res?.message || "Registration failed.",
      };
    }

    // 2. Automatically log in after registration
    const login = await api("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    });

    if (!login?.success) {
      return {
        success: false,
        error:
          login?.message ||
          "Account created, but automatic login failed. Please sign in manually.",
      };
 
    }
    

    // 3. Store cookies using shared setCookies helper
    await setCookies({
      accessToken: login.data.accessToken,
      refreshToken: login.data.refreshToken,
    });
// const decodedToken = jwt.decode(login.data.accessToken) as { exp: number } | null;
   
    return {
      success: true,
      message: "Registration successful",
    };


   
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected server error occurred.",
    };
  }

};