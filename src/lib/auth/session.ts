import { cookies } from "next/headers";
import { verifyAccessToken, type JWTPayload } from "./jwt";

export interface Session {
  userId: string;
  email: string;
  organizationId: string;
  role: string;
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access-token")?.value;
    if (!token) return null;

    const payload = verifyAccessToken(token);
    return {
      userId: payload.sub,
      email: payload.email,
      organizationId: payload.organizationId,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export function getSessionFromHeader(authHeader: string | null): JWTPayload | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: Request): JWTPayload | null {
  // Try Authorization header first
  const authHeader = request.headers.get("Authorization");
  if (authHeader) return getSessionFromHeader(authHeader);

  // Try cookie
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/access-token=([^;]+)/);
  if (tokenMatch) {
    try {
      return verifyAccessToken(decodeURIComponent(tokenMatch[1]));
    } catch {
      return null;
    }
  }
  return null;
}
