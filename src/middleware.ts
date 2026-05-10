import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, locales } from "@/i18n/config";

/**
 * URL strategy:
 *   /          → render UZ (rewrite to /uz internally)
 *   /maqolalar → render UZ (rewrite to /uz/maqolalar internally)
 *   /ru        → render RU (passes through to /ru segment)
 *   /ru/maqolalar → render RU (passes through)
 *   /uz/...    → 301 redirect to / (canonical UZ has no prefix)
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Skip Next.js internals and asset files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/llms.txt" ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/apple-icon") ||
    pathname.startsWith("/opengraph-image") ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  // Explicit /uz/* → 301 redirect to canonical (drop the prefix)
  if (first === defaultLocale) {
    const remainder = "/" + segments.slice(1).join("/");
    const url = request.nextUrl.clone();
    url.pathname = remainder === "/" ? "/" : remainder;
    return NextResponse.redirect(url, 301);
  }

  // /ru or /ru/* → pass through to [lang] route
  if (first && isLocale(first)) {
    const response = NextResponse.next();
    response.headers.set("x-locale", first);
    return response;
  }

  // Anything else: rewrite to /uz internally so [lang] route matches
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.rewrite(url);
  response.headers.set("x-locale", defaultLocale);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};

export { locales };
