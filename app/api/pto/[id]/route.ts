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

  const request = await prisma.leaveRequest.findFirst({
    where: { id, orgId },
    include: { employee: { select: { firstName: true, lastName: true } } },
  });
  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const prevStatus = request.status;
  const updated = await prisma.leaveRequest.update({ where: { id }, data: { status } });

  const typeMap: Record<string, "usedVacation" | "usedSick" | "usedPersonal"> = {
    vacation: "usedVacation",
    sick: "usedSick",
    personal: "usedPersonal",
  };
  const field = typeMap[request.type] ?? "usedVacation";

  if (status === "approved" && prevStatus !== "approved") {
    await prisma.ptoBalance.upsert({
      where: { employeeId: request.employeeId },
      create: { orgId, employeeId: request.employeeId, [field]: request.days, year: new Date().getFullYear() },
      update: { [field]: { increment: request.days } },
    });
  } else if (prevStatus === "approved" && status !== "approved") {
    await prisma.ptoBalance.upsert({
      where: { employeeId: request.employeeId },
      create: { orgId, employeeId: request.employeeId, year: new Date().getFullYear() },
      update: { [field]: { decrement: request.days } },
    });
  }

  const name = `${request.employee.firstName} ${request.employee.lastName}`;
  if (status === "approved") {
    await prisma.notification.create({
      data: { orgId, type: "pto_approved", title: "PTO Request Approved", body: `${name}'\''s ${request.type} leave (${request.days}d) approved.`, href: "/pto" },
    });
  } else if (status === "rejected") {
    await prisma.notification.create({
      data: { orgId, type: "pto_rejected", title: "PTO Request Rejected", body: `${name}'\''s ${request.type} leave request was rejected.`, href: "/pto" },
    });
  }

  return NextResponse.json(updated);
}