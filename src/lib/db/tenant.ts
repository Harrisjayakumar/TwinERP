import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { prisma } from "./client";

export interface TenantContext {
  organizationId: string;
  userId: string;
  role: string;
}

export type TenantHandler = (
  request: NextRequest,
  context: TenantContext,
  params?: Record<string, string>
) => Promise<NextResponse>;

export function withTenantAuth(handler: TenantHandler) {
  return async (request: NextRequest, params?: Record<string, string>) => {
    const session = getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify organization exists and is active
    const organization = await prisma.organization.findUnique({
      where: { id: session.organizationId, deletedAt: null },
      select: { id: true },
    });

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const tenantContext: TenantContext = {
      organizationId: session.organizationId,
      userId: session.sub,
      role: session.role,
    };

    return handler(request, tenantContext, params);
  };
}

export function buildTenantQuery(organizationId: string) {
  return {
    where: {
      organizationId,
      deletedAt: null,
    },
  };
}

export async function getOrgFromSlug(slug: string) {
  return prisma.organization.findUnique({
    where: { slug, deletedAt: null },
  });
}
