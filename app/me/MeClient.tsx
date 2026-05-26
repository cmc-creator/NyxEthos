"use client";

import { UserCircle, CalendarDays, Clock, DollarSign, Briefcase } from "lucide-react";

const c1 = "#eef5ff";
const c2 = "#b8cce8";
const c3 = "#7a9fc0";
const border = "rgba(37,112,245,0.12)";

interface LeaveRequest {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: string;
  reason: string | null;
}

interface TimeEntry {
  id: string;
  date: string;
  hours: number;
  type: string;
  status: string;
}

interface PayStub {
  id: string;
  grossPay: number;
  netPay: number;
  createdAt: string;
  payrollRun: { period: string; startDate: string; endDate: string; status: string } | null;
}

interface PtoBalance {
  vacation: number;
  sick: number;
  personal: number;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  department: string | null;
  jobTitle: string | null;
  startDate: string | null;
  employmentType: string;
  status: string;
  salary: number | null;
  ptoBalance: PtoBalance | null;
  leaveRequests: LeaveRequest[];
  timeEntries: TimeEntry[];
  payStubs: PayStub[];
}

interface Props {
  session: { name: string | null; email: string | null; role: string };
  employee: Employee | null;
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    approved: "#34d399",
    pending: "#f59e0b",
    rejected: "#f87171",
    active: "#34d399",
    inactive: "#f87171",
  };
  const color = map[status?.toLowerCase()] ?? "#7a9fc0";
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-lg capitalize"
      style={{ background: `${color}18`, color }}
    >
      {status}
    </span>
  );
}

export default function MeClient({ session, employee }: Props) {
  const initial = (session.name?.[0] ?? session.email?.[0] ?? "U").toUpperCase();
  const displayName = employee
    ? `${employee.firstName} ${employee.lastName}`
    : session.name ?? session.email ?? "User";

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #2570f5, #6366f1)" }}
        >
          {initial}
        </div>
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: c1 }}>
            {displayName}
          </h1>
          <p className="text-sm" style={{ color: c3 }}>
            {employee?.jobTitle ?? session.role}{employee?.department ? ` · ${employee.department}` : ""}
          </p>
        </div>
      </div>

      {!employee ? (
        <div className="glass-card rounded-2xl p-8 text-center" style={{ color: c3 }}>
          <UserCircle size={36} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">
            Your account isn&apos;t linked to an employee record yet.
            <br />
            Ask an admin to link your account to your employee profile.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Profile card */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={15} style={{ color: "#4d8fff" }} />
              <h2 className="text-base font-semibold font-heading" style={{ color: c1 }}>
                My Profile
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Email", value: employee.email },
                { label: "Phone", value: employee.phone ?? "—" },
                { label: "Department", value: employee.department ?? "—" },
                { label: "Job Title", value: employee.jobTitle ?? "—" },
                { label: "Employment Type", value: employee.employmentType },
                { label: "Start Date", value: employee.startDate ? fmt(employee.startDate) : "—" },
                { label: "Status", value: employee.status },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: c3 }}>
                    {label}
                  </p>
                  <p className="text-sm font-medium capitalize" style={{ color: c2 }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* PTO Balances */}
          {employee.ptoBalance && (
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays size={15} style={{ color: "#a78bfa" }} />
                <h2 className="text-base font-semibold font-heading" style={{ color: c1 }}>
                  PTO Balances
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Vacation", value: employee.ptoBalance.vacation },
                  { label: "Sick", value: employee.ptoBalance.sick },
                  { label: "Personal", value: employee.ptoBalance.personal },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl p-4 text-center"
                    style={{ background: "rgba(37,112,245,0.06)" }}
                  >
                    <p className="text-2xl font-bold font-heading" style={{ color: c1 }}>
                      {value}
                    </p>
                    <p className="text-xs mt-1" style={{ color: c3 }}>
                      {label} days
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leave Requests */}
          {employee.leaveRequests.length > 0 && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-6 py-4" style={{ borderBottom: `1px solid ${border}` }}>
                <div className="flex items-center gap-2">
                  <CalendarDays size={15} style={{ color: "#f59e0b" }} />
                  <h2 className="text-base font-semibold font-heading" style={{ color: c1 }}>
                    Recent Leave Requests
                  </h2>
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${border}` }}>
                    {["Type", "Dates", "Days", "Status"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: c3 }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employee.leaveRequests.map((req, i) => (
                    <tr
                      key={req.id}
                      style={{
                        borderBottom:
                          i < employee.leaveRequests.length - 1
                            ? `1px solid ${border}`
                            : undefined,
                      }}
                    >
                      <td className="px-5 py-3 text-sm capitalize" style={{ color: c1 }}>
                        {req.leaveType}
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: c3 }}>
                        {fmt(req.startDate)} – {fmt(req.endDate)}
                      </td>
                      <td className="px-5 py-3 text-sm font-medium" style={{ color: c2 }}>
                        {req.totalDays}d
                      </td>
                      <td className="px-5 py-3">{statusBadge(req.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Recent Time Entries */}
          {employee.timeEntries.length > 0 && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-6 py-4" style={{ borderBottom: `1px solid ${border}` }}>
                <div className="flex items-center gap-2">
                  <Clock size={15} style={{ color: "#34d399" }} />
                  <h2 className="text-base font-semibold font-heading" style={{ color: c1 }}>
                    Recent Time Entries
                  </h2>
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${border}` }}>
                    {["Date", "Hours", "Type", "Status"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: c3 }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employee.timeEntries.map((entry, i) => (
                    <tr
                      key={entry.id}
                      style={{
                        borderBottom:
                          i < employee.timeEntries.length - 1
                            ? `1px solid ${border}`
                            : undefined,
                      }}
                    >
                      <td className="px-5 py-3 text-xs" style={{ color: c3 }}>
                        {fmt(entry.date)}
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold" style={{ color: c1 }}>
                        {entry.hours}h
                      </td>
                      <td className="px-5 py-3 text-xs capitalize" style={{ color: c2 }}>
                        {entry.type}
                      </td>
                      <td className="px-5 py-3">{statusBadge(entry.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pay Stubs */}
          {employee.payStubs.length > 0 && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-6 py-4" style={{ borderBottom: `1px solid ${border}` }}>
                <div className="flex items-center gap-2">
                  <DollarSign size={15} style={{ color: "#34d399" }} />
                  <h2 className="text-base font-semibold font-heading" style={{ color: c1 }}>
                    Pay History
                  </h2>
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${border}` }}>
                    {["Period", "Gross", "Net", "Status"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: c3 }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employee.payStubs.map((stub, i) => (
                    <tr
                      key={stub.id}
                      style={{
                        borderBottom:
                          i < employee.payStubs.length - 1
                            ? `1px solid ${border}`
                            : undefined,
                      }}
                    >
                      <td className="px-5 py-3 text-xs" style={{ color: c3 }}>
                      {stub.payrollRun ? `${stub.payrollRun.period}` : fmt(stub.createdAt)}
                    </td>
                    <td className="px-5 py-3 text-sm font-medium" style={{ color: c1 }}>
                      ${stub.grossPay.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold" style={{ color: "#34d399" }}>
                      ${stub.netPay.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">{statusBadge(stub.payrollRun?.status ?? "processed")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
