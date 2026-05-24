import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function getOrgId(session: Awaited<ReturnType<typeof getServerSession>>): string | null {
  return (session?.user as { orgId?: string })?.orgId ?? null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reviews = await prisma.performanceReview.findMany({
    where: { orgId },
    include: { employee: { select: { firstName: true, lastName: true } } },
    orderBy: { reviewDate: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { employeeId, period, reviewDate, score, status, notes } = await req.json();
    if (!employeeId || !period || !reviewDate) {
      return NextResponse.json({ error: "Employee, period, and review date are required." }, { status: 400 });
    }

    const employee = await prisma.employee.findFirst({ where: { id: employeeId, orgId } });
    if (!employee) return NextResponse.json({ error: "Employee not found." }, { status: 404 });

    const review = await prisma.performanceReview.create({
      data: {
        employeeId,
        orgId,
        period,
        reviewDate: new Date(reviewDate),
        score: score !== null && score !== undefined ? parseFloat(String(score)) : null,
        status: status || "scheduled",
        notes: notes || null,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create review." }, { status: 500 });
  }
}
