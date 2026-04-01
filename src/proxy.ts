import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function proxy(request: NextRequest) {
  if (auth0) {
    try {
      return await auth0.middleware(request);
    } catch {
      // Invalid/stale session cookie — clear it and continue
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("__session");
      return response;
    }
  }
  return;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
