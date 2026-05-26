import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.RESEND_FROM_EMAIL ?? "NyxEthos HR <onboarding@resend.dev>";

export async function sendInviteEmail({
  to,
  orgName,
  role,
  inviteUrl,
}: {
  to: string;
  orgName: string;
  role: string;
  inviteUrl: string;
}) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — invite email not sent to", to);
    return { skipped: true };
  }

  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `You're invited to join ${orgName} on NyxEthos`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#0d1829;color:#eef5ff;border-radius:16px;">
        <h1 style="margin:0 0 8px;font-size:22px;color:#eef5ff;">You're invited 🎉</h1>
        <p style="color:#7a9fc0;margin:0 0 24px;">
          You've been invited to join <strong style="color:#eef5ff;">${orgName}</strong> on NyxEthos as a <strong style="color:#4d8fff;">${role}</strong>.
        </p>
        <a href="${inviteUrl}" style="display:inline-block;background:linear-gradient(135deg,#2570f5,#6366f1);color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:14px;">
          Accept Invitation
        </a>
        <p style="color:#4a7099;margin:24px 0 0;font-size:12px;">
          This link expires in 7 days. If you didn't expect this invitation, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("[email] Failed to send invite:", error);
    return { error };
  }
  return { data };
}
