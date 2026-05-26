import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import MeClient from "./MeClient";

export default async function MePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/sign-in");
  const user = session.user as { id: string; orgId: string; email?: string | null; name?: string | null; role?: string };

  // Find linked employee: first by userId, then by email
  const employee = await prisma.employee.findFirst({
    where: {
      orgId: user.orgId,
      OR: [
        { userId: user.id },
        { email: user.email ?? "" },
      ],
    },
    include: {
      ptoBalance: true,
      leaveRequests: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      timeEntries: {
        orderBy: { date: "desc" },
        take: 10,
      },
      payStubs: {
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { payrollRun: { select: { period: true, startDate: true, endDate: true, status: true } } },
      },
    },
  });

  return (
    <MeClient
      session={{
        name: user.name ?? null,
        email: user.email ?? null,
        role: user.role ?? "employee",
      }}
      employee={employee ? JSON.parse(JSON.stringify(employee)) : null}
    />
  );
}
