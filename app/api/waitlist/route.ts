import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// POST /api/waitlist
// Body: { email: string; name?: string; company?: string; plan?: string }
//
// Currently stores leads in memory (resets on redeploy).
// TO PERSIST: replace the `leads` array with a DB insert or email service call.
//   e.g. Resend:  await resend.emails.send({ from: "...", to: email, ... })
//   e.g. Loop:    await fetch("https://app.loops.so/api/v1/contacts/create", ...)
// ---------------------------------------------------------------------------

const leads: { email: string; name?: string; company?: string; plan?: string; ts: string }[] = [];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { email, name, company, plan } = body as Record<string, unknown>;

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 422 });
  }

  // Normalise
  const safeEmail = email.trim().toLowerCase().slice(0, 254);
  const safeName = typeof name === "string" ? name.trim().slice(0, 100) : undefined;
  const safeCompany = typeof company === "string" ? company.trim().slice(0, 200) : undefined;
  const safePlan = typeof plan === "string" ? plan.trim().slice(0, 50) : undefined;

  // Deduplicate
  if (leads.some((l) => l.email === safeEmail)) {
    return NextResponse.json({ message: "You're already on the list!" }, { status: 200 });
  }

  leads.push({ email: safeEmail, name: safeName, company: safeCompany, plan: safePlan, ts: new Date().toISOString() });

  // TODO: forward to email provider here
  // e.g. await sendToEmailProvider(safeEmail, safeName);

  return NextResponse.json({ message: "You're on the list! We'll be in touch soon." }, { status: 201 });
}
