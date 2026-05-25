import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { FileText, Users, CheckCircle, AlertCircle, FolderOpen } from "lucide-react";

function getOrgId(session: { user?: { orgId?: string } } | null): string | null {
  return session?.user?.orgId ?? null;
}

const complianceItems = [
  { id: 1, title: "Employee Handbook", desc: "Distribute updated handbook to all employees", category: "Policy" },
  { id: 2, title: "Anti-Harassment Training", desc: "Annual training completion required", category: "Training" },
  { id: 3, title: "I-9 Verification", desc: "Employment eligibility verification on file", category: "Legal" },
  { id: 4, title: "Safety & OSHA", desc: "Workplace safety compliance review", category: "Safety" },
  { id: 5, title: "Data Privacy (CCPA/GDPR)", desc: "Employee data handling policies", category: "Privacy" },
  { id: 6, title: "Equal Opportunity Policy", desc: "EEO policy posted and distributed", category: "Legal" },
  { id: 7, title: "Payroll Tax Compliance", desc: "Tax withholding and filings up to date", category: "Finance" },
  { id: 8, title: "Benefits Enrollment Records", desc: "Annual enrollment documentation on file", category: "Benefits" },
];

export default async function CompliancePage() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) redirect("/sign-in");

  const [employeeCount, documentCount] = await Promise.all([
    prisma.employee.count({ where: { orgId } }),
    prisma.document.count({ where: { orgId } }),
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>
            Compliance
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#7a9fc0" }}>
            Policies, audits, and regulatory requirements.
          </p>
        </div>
        <Link
          href="/documents"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: "rgba(37,112,245,0.1)",
            border: "1px solid rgba(37,112,245,0.22)",
            color: "#4d8fff",
          }}
        >
          <FolderOpen size={14} />
          View Documents
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { icon: FileText, label: "Checklist Items", value: String(complianceItems.length), sub: "Review annually", color: "blue" as const },
          { icon: Users, label: "Employees", value: String(employeeCount), sub: "On record", color: "green" as const },
          { icon: FolderOpen, label: "Documents", value: String(documentCount), sub: "Filed in system", color: "purple" as const },
          { icon: CheckCircle, label: "Categories", value: "4", sub: "Policy, Legal, Training, Safety", color: "amber" as const },
        ].map(({ icon: Icon, label, value, sub, color }) => {
          const palettes = {
            blue: { bg: "rgba(37,112,245,0.15)", text: "#4d8fff", border: "rgba(37,112,245,0.25)" },
            green: { bg: "rgba(52,211,153,0.12)", text: "#34d399", border: "rgba(52,211,153,0.25)" },
            purple: { bg: "rgba(99,102,241,0.18)", text: "#818cf8", border: "rgba(99,102,241,0.25)" },
            amber: { bg: "rgba(251,191,36,0.12)", text: "#fbbf24", border: "rgba(251,191,36,0.25)" },
          };
          const c = palettes[color];
          return (
            <div key={label} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7a9fc0" }}>{label}</span>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                  <Icon size={15} style={{ color: c.text }} />
                </div>
              </div>
              <p className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>{value}</p>
              {sub && <p className="text-xs mt-1" style={{ color: "#7a9fc0" }}>{sub}</p>}
            </div>
          );
        })}
      </div>

      {/* Compliance checklist */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(37,112,245,0.12)" }}>
          <h2 className="text-base font-semibold font-heading" style={{ color: "#eef5ff" }}>
            HR Compliance Checklist
          </h2>
          <p className="text-xs mt-1" style={{ color: "#7a9fc0" }}>
            Standard compliance items for your organization. Upload related documents to{" "}
            <Link href="/documents" style={{ color: "#4d8fff" }}>Documents</Link>.
          </p>
        </div>
        <div>
          {complianceItems.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center gap-4 px-6 py-4 border-b last:border-0"
              style={{ borderColor: "rgba(37,112,245,0.06)" }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: i % 3 === 0 ? "rgba(52,211,153,0.12)" : "rgba(37,112,245,0.1)" }}
              >
                {i % 3 === 0
                  ? <CheckCircle size={15} style={{ color: "#34d399" }} />
                  : <AlertCircle size={15} style={{ color: "#4d8fff" }} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: "#eef5ff" }}>{item.title}</p>
                <p className="text-xs" style={{ color: "#7a9fc0" }}>{item.desc}</p>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                style={{ background: "rgba(37,112,245,0.1)", color: "#4d8fff" }}
              >
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
