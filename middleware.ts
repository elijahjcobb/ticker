import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/")) {
    if (!req.cookies.get("token")) {
      return NextResponse.redirect(new URL("/sign-up", req.url));
    }
  }
}

export const config = {
  matcher: "/",
};
