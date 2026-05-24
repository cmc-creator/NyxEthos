import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { FolderOpen, FileText, Users, Upload, Plus, ExternalLink } from "lucide-react";

function getOrgId(session: Awaited<ReturnType<typeof getServerSession>>): string | null {
  return (session?.user as { orgId?: string })?.orgId ?? null;
}

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) redirect("/sign-in");

  const documents = await prisma.document.findMany({
    where: { orgId },
    include: { employee: { select: { firstName: true, lastName: true } } },
    orderBy: { uploadedAt: "desc" },
    take: 50,
  });

  const categoryMap: Record<string, number> = {};
  for (const doc of documents) {
    categoryMap[doc.category] = (categoryMap[doc.category] || 0) + 1;
  }

  const categoryColors: Record<string, { bg: string; text: string }> = {
    contract: { bg: "rgba(99,102,241,0.12)", text: "#818cf8" },
    policy: { bg: "rgba(37,112,245,0.12)", text: "#4d8fff" },
    form: { bg: "rgba(251,191,36,0.12)", text: "#fbbf24" },
    report: { bg: "rgba(52,211,153,0.12)", text: "#34d399" },
    other: { bg: "rgba(107,114,128,0.12)", text: "#9ca3af" },
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>
            Documents
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#7a9fc0" }}>
            Employee records, contracts, policies, and forms.
          </p>
        </div>
        <Link
          href="/documents/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
        >
          <Plus size={14} />
          Add Document
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { icon: FolderOpen, label: "Total Documents", value: String(documents.length), sub: "All files", color: "blue" as const },
          { icon: FileText, label: "Contracts", value: String(categoryMap.contract || 0), sub: "On file", color: "purple" as const },
          { icon: FileText, label: "Policies", value: String(categoryMap.policy || 0), sub: "Active policies", color: "green" as const },
          { icon: Users, label: "With Employee", value: String(documents.filter((d) => d.employeeId).length), sub: "Employee-linked", color: "amber" as const },
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

      {/* Documents table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "rgba(37,112,245,0.12)" }}>
          <h2 className="text-base font-semibold font-heading" style={{ color: "#eef5ff" }}>All Documents</h2>
          <Link
            href="/documents/new"
            className="flex items-center gap-1.5 text-xs font-medium opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: "#4d8fff" }}
          >
            <Upload size={12} /> Upload
          </Link>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(37,112,245,0.1)", border: "1px solid rgba(37,112,245,0.18)" }}
            >
              <FolderOpen size={24} style={{ color: "#4d8fff" }} />
            </div>
            <p className="text-base font-semibold mb-2" style={{ color: "#eef5ff" }}>No documents yet</p>
            <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "#7a9fc0" }}>
              Store contracts, policies, forms, and employee records here.
            </p>
            <Link
              href="/documents/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
            >
              <Plus size={14} /> Add First Document
            </Link>
          </div>
        ) : (
          <div>
            <div
              className="grid grid-cols-12 px-6 py-3 text-xs font-semibold uppercase tracking-widest border-b"
              style={{ color: "#7a9fc0", borderColor: "rgba(37,112,245,0.08)" }}
            >
              <span className="col-span-5">Name</span>
              <span className="col-span-2">Category</span>
              <span className="col-span-3">Employee</span>
              <span className="col-span-2">Date</span>
            </div>
            {documents.map((doc) => {
              const cc = categoryColors[doc.category] ?? categoryColors.other;
              return (
                <div
                  key={doc.id}
                  className="grid grid-cols-12 px-6 py-3.5 border-b last:border-0 items-center"
                  style={{ borderColor: "rgba(37,112,245,0.06)" }}
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(37,112,245,0.1)", border: "1px solid rgba(37,112,245,0.15)" }}
                    >
                      <FileText size={13} style={{ color: "#4d8fff" }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#eef5ff" }}>{doc.name}</p>
                      {doc.size && <p className="text-xs" style={{ color: "#7a9fc0" }}>{doc.size}</p>}
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                      style={{ background: cc.bg, color: cc.text }}
                    >
                      {doc.category}
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="text-sm truncate" style={{ color: "#b8cce8" }}>
                      {doc.employee ? `${doc.employee.firstName} ${doc.employee.lastName}` : "Organization"}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <span className="text-xs" style={{ color: "#7a9fc0" }}>
                      {new Date(doc.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    {doc.fileUrl && (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-50 hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink size={13} style={{ color: "#4d8fff" }} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
