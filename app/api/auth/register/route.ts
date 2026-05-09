import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, orgName } = await req.json();

    if (!email || !password || !orgName) {
      return NextResponse.json(
        { error: "Name, email, password, and organization name are required." },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    const org = await prisma.organization.create({
      data: {
        name: orgName,
        users: {
          create: {
            name: name || null,
            email,
            password: hashed,
            role: "admin",
          },
        },
      },
      include: { users: { select: { id: true } } },
    });

    return NextResponse.json(
      { success: true, userId: org.users[0].id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
