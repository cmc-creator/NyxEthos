import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.orgId;
  const userId = session?.user?.id;
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notifications = await prisma.notification.findMany({
    where: {
      orgId,
      OR: [{ userId: null }, { userId }],
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return NextResponse.json(notifications);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.orgId;
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { ids } = body as { ids?: string[] };

  if (ids && ids.length > 0) {
    await prisma.notification.updateMany({
      where: { id: { in: ids }, orgId },
      data: { read: true },
    });
  } else {
    // Mark all read for this org
    await prisma.notification.updateMany({
      where: { orgId },
      data: { read: true },
    });
  }

  return NextResponse.json({ ok: true });
}
