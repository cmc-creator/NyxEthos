import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function getOrgId(s: { user?: { orgId?: string } } | null) { return s?.user?.orgId ?? null; }

const DEFAULT_PLANS = [
  { name: "Medical Insurance", provider: "Blue Cross Blue Shield", type: "health", description: "Comprehensive medical coverage with low deductibles." },
  { name: "Dental & Vision", provider: "Delta Dental / EyeMed", type: "health", description: "Dental cleanings, orthodontics, and vision plan." },
  { name: "401(k) Retirement", provider: "Fidelity", type: "retirement", description: "Company matches up to 4% of contributions." },
  { name: "Life Insurance", provider: "MetLife", type: "insurance", description: "Basic life insurance at 2x annual salary." },
  { name: "Mental Health", provider: "Lyra Health", type: "wellness", description: "12 free therapy sessions per year." },
];

export async function GET() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let plans = await prisma.benefitPlan.findMany({
    where: { orgId },
    include: {
      enrollments: { where: { status: "active" }, select: { id: true, employeeId: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  if (plans.length === 0) {
    plans = await Promise.all(
      DEFAULT_PLANS.map(p =>
        prisma.benefitPlan.create({
          data: { ...p, orgId },
          include: { enrollments: { where: { status: "active" }, select: { id: true, employeeId: true } } },
        })
      )
    );
  }

  const [employeeCount, enrollments] = await Promise.all([
    prisma.employee.count({ where: { orgId, status: "active" } }),
    prisma.benefitEnrollment.findMany({ where: { orgId }, select: { planId: true, employeeId: true, status: true } }),
  ]);

  return NextResponse.json({ plans, enrollments, employeeCount });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action, planId, employeeId, enrollAll } = await req.json();

  if (action === "enroll" && planId && employeeId) {
    const plan = await prisma.benefitPlan.findFirst({ where: { id: planId, orgId } });
    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    const enrollment = await prisma.benefitEnrollment.upsert({
      where: { employeeId_planId: { employeeId, planId } },
      create: { orgId, employeeId, planId, status: "active" },
      update: { status: "active" },
    });
    return NextResponse.json(enrollment, { status: 201 });
  }

  if (action === "enroll_all" && planId) {
    const plan = await prisma.benefitPlan.findFirst({ where: { id: planId, orgId } });
    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    const employees = await prisma.employee.findMany({ where: { orgId, status: "active" }, select: { id: true } });
    await Promise.all(employees.map(e =>
      prisma.benefitEnrollment.upsert({
        where: { employeeId_planId: { employeeId: e.id, planId } },
        create: { orgId, employeeId: e.id, planId, status: "active" },
        update: { status: "active" },
      })
    ));
    return NextResponse.json({ enrolled: employees.length });
  }

  if (action === "unenroll" && planId && employeeId) {
    await prisma.benefitEnrollment.updateMany({ where: { orgId, planId, employeeId }, data: { status: "inactive" } });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}