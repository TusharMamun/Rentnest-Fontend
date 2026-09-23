import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtUtils } from "@/lib/jwt";
import { refreshApi } from "@/lib/refreshToken";

const AUTH_ROUTES = ["/login", "/signup"];
const PUBLIC_ROUTES = ["/", "/about", "/contact", "/properties", "/services"];

const ROLE_ROUTE_MAP: Record<string, string[]> = {
  "/dashboard/admin": ["ADMIN"],
  "/dashboard/landlord": ["LANDLORD"],
  "/dashboard/rentals": ["TENANT"],
  "/dashboard/payments": ["TENANT"],
  "/dashboard/reviews": ["TENANT"],
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Extract tokens from cookies
  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  // 2. Verify Tokens
  let decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string)
    : null;

  let newAccessToken: string | undefined;

  // 3. Renew Access Token ONLY when expired/missing AND Refresh Token is valid
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    try {
      const result = await refreshApi();

      const refreshedAccessToken = result?.data?.accessToken;
      if (result?.success && typeof refreshedAccessToken === "string") {
        newAccessToken = refreshedAccessToken;
        accessToken = refreshedAccessToken;

        // Re-verify the newly generated token
        decodedAccessToken = jwtUtils.verifyToken(
          refreshedAccessToken,
          process.env.JWT_ACCESS_SECRET as string
        );
      }
    } catch (error) {
      console.error("[PROXY_AUTH_ERROR] Token refresh failed:", error);
    }
  }

  // 4. Derive Role and Validity
  const userRole =
    decodedAccessToken?.role ||
    decodedAccessToken?.data?.role ||
    decodedRefreshToken?.role ||
    decodedRefreshToken?.data?.role ||
    null;

  const isValidToken = Boolean(decodedAccessToken?.success || decodedAccessToken);

  // 5. Helper Route Guards
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    route === "/"
      ? pathname === "/"
      : pathname === route || pathname.startsWith(route + "/")
  );

  // 6. Response Helper: Attaches refreshed cookie AND passes header to Server Components
  const buildResponse = (redirectResponse?: NextResponse) => {
    const requestHeaders = new Headers(request.headers);

    if (newAccessToken) {
      // Synchronize headers for immediate Server Component execution
      requestHeaders.set("cookie", `accessToken=${newAccessToken}`);
    }

    const response =
      redirectResponse ||
      NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

    if (newAccessToken) {
      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 20, // Set to 20 seconds to match JWT_ACCESS_EXPIRES_IN
        path: "/",
      });
    }
    return response;
  };

  // SCENARIO A: Token exists BUT is invalid/expired -> Clear cookie & Redirect to /login
  if (accessToken && !isValidToken && !isPublicRoute) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("accessToken");
    return response;
  }

  // SCENARIO B: Authenticated user visits Auth pages (/login, /signup) -> Redirect to /dashboard
  if (isValidToken && isAuthRoute) {
    const redirectUrl =
      userRole && ["ADMIN", "LANDLORD", "TENANT"].includes(userRole)
        ? new URL("/dashboard", request.url)
        : new URL("/", request.url);

    return buildResponse(NextResponse.redirect(redirectUrl));
  }

  // SCENARIO C: Unauthenticated user visits Protected Route -> Redirect to /login
  if (!isValidToken && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // SCENARIO D: Role-Based Access Control (RBAC)
  if (isValidToken && userRole) {
    for (const [routePrefix, allowedRoles] of Object.entries(ROLE_ROUTE_MAP)) {
      if (pathname === routePrefix || pathname.startsWith(routePrefix + "/")) {
        if (!allowedRoles.includes(userRole)) {
          return buildResponse(
            NextResponse.redirect(new URL("/not-found", request.url))
          );
        }
      }
    }
  }

  return buildResponse();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};