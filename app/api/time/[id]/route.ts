import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function getOrgId(session: { user?: { orgId?: string } } | null): string | null {
  return session?.user?.orgId ?? null;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  if (!["approved", "rejected", "pending"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const entry = await prisma.timeEntry.findFirst({
    where: { id, orgId },
    include: { employee: { select: { firstName: true, lastName: true } } },
  });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.timeEntry.update({ where: { id }, data: { status } });

  const name = `${entry.employee.firstName} ${entry.employee.lastName}`;
  if (status === "approved") {
    await prisma.notification.create({
      data: { orgId, type: "time_approved", title: "Time Entry Approved", body: `${name}'s ${entry.hours}h time entry approved.`, href: "/time" },
    });
  } else if (status === "rejected") {
    await prisma.notification.create({
      data: { orgId, type: "time_rejected", title: "Time Entry Rejected", body: `${name}'s ${entry.hours}h time entry was rejected.`, href: "/time" },
    });
  }

  return NextResponse.json(updated);
}