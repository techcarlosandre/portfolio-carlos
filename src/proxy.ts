import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Canonical domain for the portfolio
const CANONICAL_DOMAIN = "portfolio.techcarlos.com.br";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  // Only redirect if we're NOT already on the canonical domain
  // and NOT on localhost/development environments
  if (
    hostname !== CANONICAL_DOMAIN &&
    !hostname.includes("localhost") &&
    !hostname.includes("127.0.0.1") &&
    hostname !== ""
  ) {
    const url = request.nextUrl.clone();
    url.hostname = CANONICAL_DOMAIN;
    url.port = "";
    url.protocol = "https:";
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except Next.js internals and static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)",
  ],
};
