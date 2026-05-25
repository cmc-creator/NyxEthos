"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, Legend,
} from "recharts";

interface Props {
  months: { label: string; count: number }[];
  depts: [string, number][];
  activeCount: number;
  payrollRuns: { period: string; gross: number; net: number }[];
}

const TOOLTIP_STYLE = {
  backgroundColor: "#0d1829",
  border: "1px solid rgba(37,112,245,0.2)",
  borderRadius: 10,
  color: "#eef5ff",
  fontSize: 12,
};

const AXIS_TICK = { fill: "#7a9fc0", fontSize: 11 };

export default function AnalyticsCharts({ months, depts, activeCount, payrollRuns }: Props) {
  const deptData = depts.map(([dept, count]) => ({
    dept: dept.length > 14 ? dept.slice(0, 13) + "…" : dept,
    count,
    pct: activeCount > 0 ? +((count / activeCount) * 100).toFixed(1) : 0,
  }));

  const payrollData = [...payrollRuns].reverse();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* New Hires Bar Chart */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold mb-5" style={{ color: "#eef5ff" }}>
          New Hires — Last 6 Months
        </h3>
        {months.every((m) => m.count === 0) ? (
          <p className="text-xs text-center py-10" style={{ color: "#7a9fc0" }}>
            No hires in the last 6 months.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={months} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="rgba(37,112,245,0.08)" />
              <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                cursor={{ fill: "rgba(37,112,245,0.06)" }}
                formatter={(v) => [v, "New hires"]}
              />
              <Bar
                dataKey="count"
                radius={[6, 6, 0, 0]}
                fill="url(#blueGrad)"
              />
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6fa8ff" />
                  <stop offset="100%" stopColor="#2570f5" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Dept Headcount Bar Chart */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold mb-5" style={{ color: "#eef5ff" }}>
          Headcount by Department
        </h3>
        {deptData.length === 0 ? (
          <p className="text-xs text-center py-10" style={{ color: "#7a9fc0" }}>
            Add department info to employees to see this chart.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={deptData}
              layout="vertical"
              barSize={14}
              margin={{ top: 0, right: 32, left: 4, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} stroke="rgba(37,112,245,0.08)" />
              <XAxis type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="dept"
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                cursor={{ fill: "rgba(99,102,241,0.06)" }}
                formatter={(v, _, p) => [
                  `${v} (${ (p.payload as { pct?: number }).pct ?? 0 }%)`,
                  "Employees",
                ]}
              />
              <Bar
                dataKey="count"
                radius={[0, 6, 6, 0]}
                fill="url(#purpleGrad)"
              />
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4d8fff" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Payroll Trend Line Chart */}
      {payrollData.length > 0 && (
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-5" style={{ color: "#eef5ff" }}>
            Payroll Trend
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={payrollData} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(37,112,245,0.08)" />
              <XAxis dataKey="period" tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <YAxis
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
                }
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v, name) => [
                  new Intl.NumberFormat("en-US", {
                    style: "currency", currency: "USD", maximumFractionDigits: 0,
                  }).format(Number(v)),
                  name === "gross" ? "Gross" : "Net",
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: "#7a9fc0", paddingTop: 8 }}
                formatter={(v) => (v === "gross" ? "Gross" : "Net")}
              />
              <Line
                type="monotone"
                dataKey="gross"
                stroke="#4d8fff"
                strokeWidth={2}
                dot={{ fill: "#4d8fff", r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#34d399"
                strokeWidth={2}
                dot={{ fill: "#34d399", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
