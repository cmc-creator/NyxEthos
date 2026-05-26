import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orgId = session.user.orgId;

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ employees: [], documents: [], leaveRequests: [], pages: [] });

  const search = { contains: q, mode: "insensitive" as const };

  const [employees, documents, leaveRequests] = await Promise.all([
    prisma.employee.findMany({
      where: {
        orgId,
        OR: [
          { firstName: search },
          { lastName: search },
          { email: search },
          { department: search },
          { jobTitle: search },
        ],
      },
      select: { id: true, firstName: true, lastName: true, department: true, jobTitle: true, status: true },
      take: 5,
    }),
    prisma.document.findMany({
      where: { orgId, name: search },
      select: { id: true, name: true, category: true, uploadedAt: true },
      take: 5,
    }),
    prisma.leaveRequest.findMany({
      where: {
        orgId,
        employee: { OR: [{ firstName: search }, { lastName: search }] },
      },
      include: { employee: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const pages = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Employees", href: "/employees" },
    { label: "Payroll", href: "/payroll" },
    { label: "Time & Attendance", href: "/time" },
    { label: "PTO & Leave", href: "/pto" },
    { label: "PTO Calendar", href: "/pto/calendar" },
    { label: "Reports", href: "/reports" },
    { label: "Analytics", href: "/analytics" },
    { label: "Onboarding", href: "/onboarding" },
    { label: "Performance", href: "/performance" },
    { label: "Benefits", href: "/benefits" },
    { label: "Compliance", href: "/compliance" },
    { label: "Documents", href: "/documents" },
    { label: "Org Chart", href: "/org-chart" },
    { label: "Settings", href: "/settings" },
    { label: "Team Members", href: "/settings/team" },
  ].filter((p) => p.label.toLowerCase().includes(q.toLowerCase()));

  return NextResponse.json({ employees, documents, leaveRequests, pages });
}