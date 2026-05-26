"use client";

import { useState } from "react";
import {
  FileBarChart,
  Download,
  Users,
  DollarSign,
  Clock,
  Calendar,
} from "lucide-react";

const c1 = "#eef5ff";
const c2 = "#a0b8d8";
const c3 = "#7a9fc0";

interface Stat {
  label: string;
  value: string | number;
}

interface ReportCard {
  type: "headcount" | "payroll" | "time" | "pto";
  title: string;
  description: string;
  Icon: React.ElementType;
  color: string;
  stats: Stat[];
}

interface Props {
  headcount: { total: number; active: number; inactive: number; departments: number };
  payroll: { totalGross: number; totalNet: number; runs: number };
  timeData: { totalHours: number; approvedHours: number; employees: number };
  ptoData: { totalRequests: number; approved: number; pending: number; totalDays: number };
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ReportsClient({ headcount, payroll, timeData, ptoData }: Props) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const reports: ReportCard[] = [
    {
      type: "headcount",
      title: "Headcount Report",
      description: "Employee roster with department breakdown, status, and employment type.",
      Icon: Users,
      color: "#2570f5",
      stats: [
        { label: "Total Employees", value: headcount.total },
        { label: "Active", value: headcount.active },
        { label: "Inactive", value: headcount.inactive },
        { label: "Departments", value: headcount.departments },
      ],
    },
    {
      type: "payroll",
      title: "Payroll Summary",
      description: "All payroll runs with gross/net totals and per-employee pay stub data.",
      Icon: DollarSign,
      color: "#10b981",
      stats: [
        { label: "Total Gross", value: fmt(payroll.totalGross) },
        { label: "Total Net", value: fmt(payroll.totalNet) },
        { label: "Payroll Runs", value: payroll.runs },
      ],
    },
    {
      type: "time",
      title: "Time & Attendance",
      description: "Time entries with hours worked, approval status, and employee breakdown.",
      Icon: Clock,
      color: "#f59e0b",
      stats: [
        { label: "Total Hours", value: timeData.totalHours.toFixed(1) },
        { label: "Approved Hours", value: timeData.approvedHours.toFixed(1) },
        { label: "Employees", value: timeData.employees },
      ],
    },
    {
      type: "pto",
      title: "PTO & Leave",
      description: "Leave requests with type, dates, days used, and approval status.",
      Icon: Calendar,
      color: "#8b5cf6",
      stats: [
        { label: "Total Requests", value: ptoData.totalRequests },
        { label: "Approved", value: ptoData.approved },
        { label: "Pending", value: ptoData.pending },
        { label: "Days Taken", value: ptoData.totalDays },
      ],
    },
  ];

  const downloadCSV = async (type: string) => {
    setDownloading(type);
    try {
      const res = await fetch(`/api/export?type=${type}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-report-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silently fail
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(37,112,245,0.15)" }}
        >
          <FileBarChart size={18} style={{ color: "#4d8fff" }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: c1 }}>
            Reports
          </h1>
          <p className="text-sm" style={{ color: c3 }}>
            Export HR data to CSV
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((report) => (
          <div key={report.type} className="glass-card rounded-2xl p-6">
            {/* Report header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${report.color}18` }}
                >
                  <report.Icon size={18} style={{ color: report.color }} />
                </div>
                <div>
                  <h2 className="text-base font-semibold font-heading" style={{ color: c1 }}>
                    {report.title}
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: c3 }}>
                    {report.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {report.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl px-3 py-2"
                  style={{ background: "rgba(37,112,245,0.06)" }}
                >
                  <p className="text-xs" style={{ color: c3 }}>
                    {stat.label}
                  </p>
                  <p className="text-lg font-bold font-heading" style={{ color: c1 }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Export button */}
            <button
              onClick={() => downloadCSV(report.type)}
              disabled={downloading === report.type}
              className="flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: `linear-gradient(135deg, ${report.color}, ${report.color}cc)` }}
            >
              <Download size={13} />
              {downloading === report.type ? "Exporting…" : "Export CSV"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
