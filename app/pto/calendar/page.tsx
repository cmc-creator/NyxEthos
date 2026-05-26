"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Users, Loader2 } from "lucide-react";

type LeaveRequest = {
  id: string; type: string; startDate: string; endDate: string; days: number; status: string;
  employee: { id: string; firstName: string; lastName: string };
};

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const EMPLOYEE_COLORS = ["#4d8fff","#34d399","#f87171","#fbbf24","#818cf8","#f472b6","#38bdf8","#fb923c","#a3e635","#e879f9"];

function colorFor(id: string, empMap: Record<string, number>) {
  if (!(id in empMap)) return "#4d8fff";
  return EMPLOYEE_COLORS[empMap[id] % EMPLOYEE_COLORS.length];
}

export default function PtoCalendarPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [today] = useState(new Date());
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  useEffect(() => {
    fetch("/api/pto").then(r => r.json()).then(d => {
      setRequests(Array.isArray(d) ? d.filter((r: LeaveRequest) => r.status === "approved" || r.status === "pending") : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function prev() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function next() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  // Build empColorMap
  const empIds = Array.from(new Set(requests.map(r => r.employee.id)));
  const empMap: Record<string, number> = Object.fromEntries(empIds.map((id, i) => [id, i]));

  // For each day, find requests that cover it
  function requestsForDay(day: number): LeaveRequest[] {
    const d = new Date(year, month, day);
    return requests.filter(r => {
      const s = new Date(r.startDate); s.setHours(0,0,0,0);
      const e = new Date(r.endDate); e.setHours(23,59,59,0);
      return d >= s && d <= e;
    });
  }

  // "Who's off today"
  const todayRequests = requestsForDay(today.getDate()).filter(() => today.getFullYear() === year && today.getMonth() === month);

  const glass = { background: "rgba(10,24,50,0.7)", border: "1px solid rgba(37,112,245,0.18)" };

  if (loading) return <div className="p-8 flex items-center justify-center min-h-[40vh]"><Loader2 size={22} className="animate-spin text-nyx-blue" /></div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/pto" className="flex items-center gap-1.5 text-nyx-muted hover:text-nyx-white text-sm transition-colors">
          <ArrowLeft size={14} /> PTO
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-nyx-white">PTO Calendar</h1>
          <p className="text-xs text-nyx-muted">Approved & pending time-off by employee</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl p-5" style={glass}>
            {/* Month nav */}
            <div className="flex items-center justify-between mb-5">
              <button onClick={prev} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors">
                <ChevronLeft size={16} style={{ color: "#7a9fc0" }} />
              </button>
              <h2 className="text-base font-bold text-nyx-white">{MONTH_NAMES[month]} {year}</h2>
              <button onClick={next} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors">
                <ChevronRight size={16} style={{ color: "#7a9fc0" }} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAY_NAMES.map(d => (
                <div key={d} className="text-center text-xs font-semibold uppercase tracking-wider py-1" style={{ color: "#7a9fc0" }}>{d}</div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) return <div key={i} className="h-20 rounded-lg" />;
                const dayReqs = requestsForDay(day);
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                return (
                  <div key={i} className="h-20 rounded-lg p-1.5 flex flex-col"
                    style={{
                      background: isToday ? "rgba(37,112,245,0.15)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isToday ? "rgba(37,112,245,0.4)" : "rgba(37,112,245,0.06)"}`,
                    }}>
                    <span className="text-xs font-semibold mb-1" style={{ color: isToday ? "#4d8fff" : "#7a9fc0" }}>{day}</span>
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      {dayReqs.slice(0, 3).map(r => (
                        <div key={r.id} className="text-[10px] px-1.5 py-0.5 rounded truncate font-medium"
                          title={`${r.employee.firstName} ${r.employee.lastName} (${r.type})`}
                          style={{
                            background: colorFor(r.employee.id, empMap) + "25",
                            color: colorFor(r.employee.id, empMap),
                            border: `1px solid ${colorFor(r.employee.id, empMap)}40`,
                          }}>
                          {r.employee.firstName}
                        </div>
                      ))}
                      {dayReqs.length > 3 && (
                        <div className="text-[10px] text-nyx-muted px-1">+{dayReqs.length - 3}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Today's absences */}
          <div className="rounded-2xl p-4" style={glass}>
            <div className="flex items-center gap-2 mb-3">
              <Users size={14} style={{ color: "#4d8fff" }} />
              <span className="text-xs font-semibold uppercase tracking-wider text-nyx-muted">Out Today</span>
            </div>
            {todayRequests.length === 0 ? (
              <p className="text-xs text-nyx-muted">Everyone&apos;s in!</p>
            ) : todayRequests.map(r => (
              <div key={r.id} className="flex items-center gap-2 py-1.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: colorFor(r.employee.id, empMap) + "25", color: colorFor(r.employee.id, empMap) }}>
                  {r.employee.firstName[0]}{r.employee.lastName[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-nyx-white font-medium truncate">{r.employee.firstName} {r.employee.lastName}</p>
                  <p className="text-[10px] text-nyx-muted capitalize">{r.type}</p>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full ml-auto flex-shrink-0 capitalize font-medium"
                  style={r.status === "approved" ? { background: "rgba(52,211,153,0.12)", color: "#34d399" } : { background: "rgba(251,191,36,0.1)", color: "#fbbf24" }}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="rounded-2xl p-4" style={glass}>
            <p className="text-xs font-semibold uppercase tracking-wider text-nyx-muted mb-3">Employees</p>
            <div className="space-y-1.5">
              {empIds.slice(0, 10).map(eid => {
                const req = requests.find(r => r.employee.id === eid)!;
                return (
                  <div key={eid} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: colorFor(eid, empMap) }} />
                    <span className="text-xs text-nyx-muted truncate">{req.employee.firstName} {req.employee.lastName}</span>
                  </div>
                );
              })}
              {empIds.length === 0 && <p className="text-xs text-nyx-muted">No approved/pending PTO this period.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}