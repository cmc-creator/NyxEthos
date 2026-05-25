import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { GitBranch, Users } from "lucide-react";

function getOrgId(session: { user?: { orgId?: string } } | null) {
  return session?.user?.orgId ?? null;
}

const c1 = "#eef5ff";
const c2 = "#a0b8d8";
const c3 = "#7a9fc0";

export default async function OrgChartPage() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) redirect("/login");

  const employees = await prisma.employee.findMany({
    where: { orgId },
    orderBy: [{ department: "asc" }, { lastName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      jobTitle: true,
      department: true,
      status: true,
      managerId: true,
    },
  });

  // Group by department
  const deptMap = new Map<string, typeof employees>();
  for (const emp of employees) {
    const dept = emp.department ?? "Unassigned";
    if (!deptMap.has(dept)) deptMap.set(dept, []);
    deptMap.get(dept)!.push(emp);
  }
  const departments = [...deptMap.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  );

  const empIndex = new Map(employees.map((e) => [e.id, e]));

  const deptColors: Record<string, string> = {
    Engineering: "#2570f5",
    Product: "#6366f1",
    Design: "#ec4899",
    Marketing: "#f59e0b",
    Sales: "#10b981",
    Finance: "#14b8a6",
    HR: "#8b5cf6",
    Operations: "#f97316",
    Legal: "#ef4444",
    Unassigned: "#4b5563",
  };

  function colorFor(dept: string) {
    return deptColors[dept] ?? "#2570f5";
  }

  function initials(first: string, last: string) {
    return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(37,112,245,0.15)" }}
        >
          <GitBranch size={18} style={{ color: "#4d8fff" }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: c1 }}>
            Org Chart
          </h1>
          <p className="text-sm" style={{ color: c3 }}>
            {employees.length} employees across {departments.length} departments
          </p>
        </div>
      </div>

      {employees.length === 0 ? (
        <div
          className="glass-card rounded-2xl p-16 flex flex-col items-center gap-3"
          style={{ color: c3 }}
        >
          <Users size={40} style={{ opacity: 0.4 }} />
          <p className="text-sm">No employees yet. Add employees to see the org chart.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {departments.map(([dept, members]) => {
            const color = colorFor(dept);
            return (
              <div key={dept}>
                {/* Department header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-2 h-8 rounded-full"
                    style={{ background: color }}
                  />
                  <div>
                    <h2
                      className="text-base font-semibold font-heading"
                      style={{ color: c1 }}
                    >
                      {dept}
                    </h2>
                    <p className="text-xs" style={{ color: c3 }}>
                      {members.length}{" "}
                      {members.length === 1 ? "member" : "members"}
                    </p>
                  </div>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {members.map((emp) => {
                    const manager = emp.managerId
                      ? empIndex.get(emp.managerId)
                      : null;
                    return (
                      <div
                        key={emp.id}
                        className="glass-card rounded-xl p-4 flex flex-col gap-2 hover:scale-[1.02] transition-transform"
                        style={{
                          borderLeft: `3px solid ${color}`,
                          opacity: emp.status === "inactive" ? 0.55 : 1,
                        }}
                      >
                        {/* Avatar + name */}
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${color}, ${color}99)`,
                            }}
                          >
                            {initials(emp.firstName, emp.lastName)}
                          </div>
                          <div className="min-w-0">
                            <p
                              className="text-sm font-semibold truncate"
                              style={{ color: c1 }}
                            >
                              {emp.firstName} {emp.lastName}
                            </p>
                            {emp.status === "inactive" && (
                              <span
                                className="text-xs px-1.5 py-0.5 rounded"
                                style={{
                                  background: "rgba(239,68,68,0.12)",
                                  color: "#f87171",
                                }}
                              >
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        {emp.jobTitle && (
                          <p className="text-xs truncate" style={{ color: c2 }}>
                            {emp.jobTitle}
                          </p>
                        )}

                        {/* Reports to */}
                        {manager && (
                          <p className="text-xs truncate" style={{ color: c3 }}>
                            Reports to {manager.firstName} {manager.lastName}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
