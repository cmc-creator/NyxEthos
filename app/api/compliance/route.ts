import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function getOrgId(s: { user?: { orgId?: string } } | null) { return s?.user?.orgId ?? null; }

const DEFAULT_TASKS = [
  { title: "Employee Handbook Acknowledgment", description: "All employees must sign the latest handbook.", category: "policy" },
  { title: "Anti-Harassment Training", description: "Annual mandatory training for all staff.", category: "training" },
  { title: "I-9 Employment Eligibility", description: "Verify and file I-9 for all new hires.", category: "legal" },
  { title: "Safety & OSHA Compliance", description: "Conduct quarterly safety audits.", category: "safety" },
  { title: "Data Privacy & Security Policy", description: "Annual data privacy review and sign-off.", category: "policy" },
  { title: "EEO Reporting", description: "Submit annual EEO-1 report.", category: "legal" },
  { title: "Payroll Tax Compliance", description: "Quarterly federal and state payroll tax filings.", category: "finance" },
  { title: "Benefits Open Enrollment", description: "Annual benefits enrollment window (Nov).", category: "benefits" },
];

export async function GET() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let tasks = await prisma.complianceTask.findMany({ where: { orgId }, orderBy: { createdAt: "asc" } });

  if (tasks.length === 0) {
    tasks = await Promise.all(
      DEFAULT_TASKS.map(t => prisma.complianceTask.create({ data: { ...t, orgId, status: "pending" } }))
    );
  }

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, category, dueDate } = await req.json();
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });
  const task = await prisma.complianceTask.create({
    data: { orgId, title, description: description || null, category: category || "policy", dueDate: dueDate ? new Date(dueDate) : null, status: "pending" },
  });
  return NextResponse.json(task, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 });

  const task = await prisma.complianceTask.findFirst({ where: { id, orgId } });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.complianceTask.update({
    where: { id },
    data: {
      status,
      completedAt: status === "completed" ? new Date() : null,
    },
  });
  return NextResponse.json(updated);
}