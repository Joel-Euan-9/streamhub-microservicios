import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  console.log("Middleware ejecutado. Token:", token);
  const { pathname } = req.nextUrl;

  if (!token && pathname.startsWith("/peliculas")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

    if (!token && pathname.startsWith("/inicio")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!token && pathname.startsWith("/studio")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && (pathname === "/login" || pathname === "/register") && req.method === "GET") {
    return NextResponse.redirect(new URL("/inicio", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/peliculas/:path*", "/inicio", "/register", "/login", "/studio/:path*"]
};