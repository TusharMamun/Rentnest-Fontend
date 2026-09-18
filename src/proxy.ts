import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const AUTH_ROUTES = ["/login", "/signup"];
const PUBLIC_ROUTES = ["/", "/about", "/contact", "/properties", "/services"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get("accessToken")?.value;

  if (accessToken && AUTH_ROUTES.includes(pathname)) {
    const decodedToken = jwt.decode(accessToken) as JwtPayload | null;

    console.log(decodedToken, "decodedToken");

    if (!decodedToken) {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }

    const userRole = decodedToken.role;

    if (
      userRole === "ADMIN" ||
      userRole === "LANDLORD" ||
      userRole === "TENANT"
    ) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }

    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }
// const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
if(!accessToken && !isPublicRoute && !isAuthRoute) {
  return NextResponse.redirect(
    new URL("/login", request.url)
  );
}


  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
};
