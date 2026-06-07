import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/pricing",
  "/demo",
  "/contact",
  "/about",
  "/status",
  "/changelog",
];

const PUBLIC_PREFIXES = [
  "/features/",
  "/blog/",
  "/docs/",
  "/legal/",
  "/api/auth/",
  "/api/v1/",
  "/super-admin/login",
  "/_next/",
  "/favicon",
  "/robots",
  "/sitemap",
];

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function extractOrgSlug(host: string): string | null {
  const appDomain = process.env.NEXT_PUBLIC_APP_URL?.replace(/https?:\/\//, "") || "twinerp.io";
  if (host === appDomain || host === `www.${appDomain}`) return null;
  if (host.endsWith(`.${appDomain}`)) {
    const subdomain = host.replace(`.${appDomain}`, "");
    if (subdomain && subdomain !== "www" && subdomain !== "app") {
      return subdomain;
    }
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  const requestHeaders = new Headers(request.headers);

  // Extract and inject org slug from subdomain
  const orgSlug = extractOrgSlug(host);
  if (orgSlug) {
    requestHeaders.set("x-org-slug", orgSlug);
  }

  // Inject current pathname for layouts
  requestHeaders.set("x-pathname", pathname);

  // Allow public routes through
  if (isPublicRoute(pathname)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Super admin routes require super-admin cookie
  if (pathname.startsWith("/super-admin")) {
    const superAdminToken = request.cookies.get("super-admin-token")?.value;
    if (!superAdminToken) {
      return NextResponse.redirect(new URL("/super-admin/login", request.url));
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Protected app routes require auth token
  const accessToken = request.cookies.get("access-token")?.value;
  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Basic JWT format validation (edge runtime — no crypto available)
  const parts = accessToken.split(".");
  if (parts.length !== 3) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("access-token");
    return response;
  }

  // Decode payload to check expiry
  try {
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("access-token");
      return response;
    }
    // Inject userId and orgId headers
    if (payload.sub) requestHeaders.set("x-user-id", payload.sub);
    if (payload.organizationId) requestHeaders.set("x-organization-id", payload.organizationId);
  } catch {
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("access-token");
    return response;
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
