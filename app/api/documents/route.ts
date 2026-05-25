import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function getOrgId(session: { user?: { orgId?: string } } | null): string | null {
  return session?.user?.orgId ?? null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const documents = await prisma.document.findMany({
    where: { orgId },
    include: { employee: { select: { firstName: true, lastName: true } } },
    orderBy: { uploadedAt: "desc" },
  });
  return NextResponse.json(documents);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, category, employeeId, fileUrl, size } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Document name is required." }, { status: 400 });
    }

    if (employeeId) {
      const employee = await prisma.employee.findFirst({ where: { id: employeeId, orgId } });
      if (!employee) return NextResponse.json({ error: "Employee not found." }, { status: 404 });
    }

    const document = await prisma.document.create({
      data: {
        name,
        category: category || "other",
        employeeId: employeeId || null,
        orgId,
        fileUrl: fileUrl || null,
        size: size || null,
      },
    });
    return NextResponse.json(document, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add document." }, { status: 500 });
  }
}
