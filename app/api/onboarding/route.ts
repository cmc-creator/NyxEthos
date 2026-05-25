import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function getOrgId(session: { user?: { orgId?: string } } | null) {
  return session?.user?.orgId ?? null;
}

const DEFAULT_TASKS = [
  { title: "Complete HR paperwork & contracts", category: "hr", order: 1, daysOffset: 1 },
  { title: "Set up workstation & access credentials", category: "it", order: 2, daysOffset: 3 },
  { title: "System accounts & software installation", category: "it", order: 3, daysOffset: 3 },
  { title: "Benefits enrollment", category: "hr", order: 4, daysOffset: 5 },
  { title: "Review company handbook & policies", category: "training", order: 5, daysOffset: 7 },
  { title: "Department orientation meeting", category: "social", order: 6, daysOffset: 7 },
  { title: "Meet the team lunch / call", category: "social", order: 7, daysOffset: 10 },
  { title: "Role-specific training", category: "training", order: 8, daysOffset: 14 },
  { title: "30-day check-in with manager", category: "milestone", order: 9, daysOffset: 30 },
  { title: "60-day performance touch-base", category: "milestone", order: 10, daysOffset: 60 },
  { title: "90-day review", category: "milestone", order: 11, daysOffset: 90 },
];

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plans = await prisma.onboardingPlan.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
    include: {
      employee: { select: { firstName: true, lastName: true, jobTitle: true, department: true } },
      tasks: { orderBy: { order: "asc" } },
    },
  });

  return NextResponse.json(plans);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { employeeId, templateName } = (await req.json()) as {
    employeeId?: string;
    templateName?: string;
  };

  if (!employeeId || !templateName?.trim()) {
    return NextResponse.json({ error: "employeeId and templateName required" }, { status: 400 });
  }

  // Verify employee belongs to this org
  const employee = await prisma.employee.findFirst({
    where: { id: employeeId, orgId },
  });
  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  const now = new Date();

  const plan = await prisma.onboardingPlan.create({
    data: {
      orgId,
      employeeId,
      templateName: templateName.trim(),
      status: "in_progress",
      tasks: {
        create: DEFAULT_TASKS.map((t) => {
          const due = new Date(now);
          due.setDate(due.getDate() + t.daysOffset);
          return {
            title: t.title,
            category: t.category,
            order: t.order,
            dueDate: due,
          };
        }),
      },
    },
    include: { tasks: true },
  });

  return NextResponse.json(plan, { status: 201 });
}
