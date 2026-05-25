import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function getOrgId(session: { user?: { orgId?: string } } | null) {
  return session?.user?.orgId ?? null;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { completed } = (await req.json()) as { completed: boolean };

  // Verify task exists and belongs to the org
  const task = await prisma.onboardingTask.findFirst({
    where: { id, plan: { orgId } },
  });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.onboardingTask.update({
    where: { id },
    data: { completedAt: completed ? new Date() : null },
  });

  // Update plan status: if all tasks done, mark completed
  const siblings = await prisma.onboardingTask.findMany({
    where: { planId: task.planId },
    select: { completedAt: true },
  });
  const allDone = siblings.every((t) => t.completedAt !== null);
  await prisma.onboardingPlan.update({
    where: { id: task.planId },
    data: { status: allDone ? "completed" : "in_progress" },
  });

  return NextResponse.json(updated);
}
