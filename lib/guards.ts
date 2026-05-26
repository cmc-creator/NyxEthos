import { Session } from "next-auth";
import { NextResponse } from "next/server";

type SessionUser = Session["user"] & { orgId?: string; role?: string; id?: string };

export function getSessionUser(session: Session | null): SessionUser | null {
  return session?.user as SessionUser ?? null;
}

export function requireAdmin(session: Session | null): { user: SessionUser } | NextResponse {
  const user = getSessionUser(session);
  if (!user?.orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role === "employee") {
    return NextResponse.json({ error: "Forbidden — admin access required" }, { status: 403 });
  }
  return { user };
}

export function requireAuth(session: Session | null): { user: SessionUser } | NextResponse {
  const user = getSessionUser(session);
  if (!user?.orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return { user };
}
