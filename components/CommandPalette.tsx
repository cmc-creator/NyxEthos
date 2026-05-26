"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, FileText, CalendarDays, LayoutDashboard } from "lucide-react";

type Employee = { id: string; firstName: string; lastName: string; department: string | null; jobTitle: string | null; status: string };
type Document = { id: string; name: string; category: string };
type LeaveRequest = { id: string; type: string; status: string; employee: { firstName: string; lastName: string } };
type Page = { label: string; href: string };

type Results = {
  employees: Employee[];
  documents: Document[];
  leaveRequests: LeaveRequest[];
  pages: Page[];
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results>({ employees: [], documents: [], leaveRequests: [], pages: [] });
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // Open on Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults({ employees: [], documents: [], leaveRequests: [], pages: [] });
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Debounced search
  const doSearch = useCallback((q: string) => {
    if (!q.trim()) { setResults({ employees: [], documents: [], leaveRequests: [], pages: [] }); return; }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => { setResults(data); setActiveIdx(0); })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 200);
  };

  // Flatten all results for keyboard nav
  const flatItems = [
    ...results.pages.map((p) => ({ label: p.label, sub: "Page", href: p.href, icon: "page" as const })),
    ...results.employees.map((e) => ({ label: `${e.firstName} ${e.lastName}`, sub: e.department ?? e.jobTitle ?? "Employee", href: `/employees/${e.id}`, icon: "employee" as const })),
    ...results.documents.map((d) => ({ label: d.name, sub: d.category, href: "/documents", icon: "document" as const })),
    ...results.leaveRequests.map((l) => ({ label: `${l.employee.firstName} ${l.employee.lastName}`, sub: `${l.type} leave — ${l.status}`, href: "/pto", icon: "pto" as const })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, flatItems.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && flatItems[activeIdx]) {
      router.push(flatItems[activeIdx].href);
      setOpen(false);
    }
  };

  const navigate = (href: string) => { router.push(href); setOpen(false); };

  if (!open) return null;

  const iconMap = {
    page: <LayoutDashboard size={14} color="#7a9fc0" />,
    employee: <Users size={14} color="#7a9fc0" />,
    document: <FileText size={14} color="#7a9fc0" />,
    pto: <CalendarDays size={14} color="#7a9fc0" />,
  };

  const hasResults = flatItems.length > 0;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "12vh", background: "rgba(7,13,25,0.75)", backdropFilter: "blur(4px)" }}
      onClick={() => setOpen(false)}
    >
      <div
        style={{ width: "100%", maxWidth: 580, background: "linear-gradient(135deg,#0d1829,#111e35)", border: "1px solid rgba(37,112,245,0.3)", borderRadius: 16, boxShadow: "0 24px 80px rgba(0,0,0,0.6)", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: "1px solid rgba(37,112,245,0.15)" }}>
          <Search size={16} color="#7a9fc0" />
          <input
            ref={inputRef}
            value={query}
            onChange={handleChange}
            placeholder="Search employees, documents, pages..."
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 15, color: "#eef5ff", caretColor: "#2570f5" }}
          />
          {loading && <div style={{ width: 14, height: 14, border: "2px solid rgba(37,112,245,0.3)", borderTopColor: "#2570f5", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />}
          <kbd style={{ fontSize: 11, color: "#7a9fc0", background: "rgba(37,112,245,0.1)", border: "1px solid rgba(37,112,245,0.2)", borderRadius: 5, padding: "2px 6px" }}>ESC</kbd>
        </div>

        {/* Results */}
        {!query && (
          <div style={{ padding: "24px 16px", textAlign: "center", color: "#4a7099", fontSize: 13 }}>
            Type to search across your HR platform
          </div>
        )}
        {query && !hasResults && !loading && (
          <div style={{ padding: "24px 16px", textAlign: "center", color: "#4a7099", fontSize: 13 }}>
            No results for &ldquo;{query}&rdquo;
          </div>
        )}
        {hasResults && (
          <div style={{ maxHeight: 400, overflowY: "auto", padding: "8px 0" }}>
            {results.pages.length > 0 && (
              <Section label="Pages" items={results.pages.map((p) => ({ label: p.label, sub: "Page", href: p.href, icon: iconMap.page }))} flatItems={flatItems} activeIdx={activeIdx} onHover={setActiveIdx} onClick={navigate} iconMap={iconMap} />
            )}
            {results.employees.length > 0 && (
              <Section label="Employees" items={results.employees.map((e) => ({ label: `${e.firstName} ${e.lastName}`, sub: e.department ?? e.jobTitle ?? "Employee", href: `/employees/${e.id}`, icon: iconMap.employee }))} flatItems={flatItems} activeIdx={activeIdx} onHover={setActiveIdx} onClick={navigate} iconMap={iconMap} />
            )}
            {results.documents.length > 0 && (
              <Section label="Documents" items={results.documents.map((d) => ({ label: d.name, sub: d.category, href: "/documents", icon: iconMap.document }))} flatItems={flatItems} activeIdx={activeIdx} onHover={setActiveIdx} onClick={navigate} iconMap={iconMap} />
            )}
            {results.leaveRequests.length > 0 && (
              <Section label="PTO Requests" items={results.leaveRequests.map((l) => ({ label: `${l.employee.firstName} ${l.employee.lastName}`, sub: `${l.type} — ${l.status}`, href: "/pto", icon: iconMap.pto }))} flatItems={flatItems} activeIdx={activeIdx} onHover={setActiveIdx} onClick={navigate} iconMap={iconMap} />
            )}
          </div>
        )}
        <div style={{ padding: "8px 16px", borderTop: "1px solid rgba(37,112,245,0.1)", display: "flex", gap: 16, fontSize: 11, color: "#4a7099" }}>
          <span><kbd style={{ fontSize: 10, background: "rgba(37,112,245,0.08)", border: "1px solid rgba(37,112,245,0.15)", borderRadius: 4, padding: "1px 5px", color: "#7a9fc0" }}>↑↓</kbd> navigate</span>
          <span><kbd style={{ fontSize: 10, background: "rgba(37,112,245,0.08)", border: "1px solid rgba(37,112,245,0.15)", borderRadius: 4, padding: "1px 5px", color: "#7a9fc0" }}>↵</kbd> select</span>
          <span><kbd style={{ fontSize: 10, background: "rgba(37,112,245,0.08)", border: "1px solid rgba(37,112,245,0.15)", borderRadius: 4, padding: "1px 5px", color: "#7a9fc0" }}>Ctrl+K</kbd> toggle</span>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

type Item = { label: string; sub: string; href: string; icon: React.ReactNode };
type FlatItem = { label: string; sub: string; href: string; icon: string };

function Section({ label, items, flatItems, activeIdx, onHover, onClick }: {
  label: string;
  items: Item[];
  flatItems: FlatItem[];
  activeIdx: number;
  onHover: (i: number) => void;
  onClick: (href: string) => void;
  iconMap: Record<string, React.ReactNode>;
}) {
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(122,159,192,0.5)", padding: "6px 16px 2px" }}>{label}</p>
      {items.map((item) => {
        const globalIdx = flatItems.findIndex((f) => f.href === item.href && f.label === item.label);
        const active = globalIdx === activeIdx;
        return (
          <button
            key={item.href + item.label}
            onMouseEnter={() => onHover(globalIdx)}
            onClick={() => onClick(item.href)}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 16px", background: active ? "rgba(37,112,245,0.15)" : "transparent", border: "none", cursor: "pointer", borderLeft: active ? "2px solid #2570f5" : "2px solid transparent", textAlign: "left" }}
          >
            {item.icon}
            <div>
              <div style={{ fontSize: 13, color: "#eef5ff", fontWeight: active ? 500 : 400 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: "#4a7099" }}>{item.sub}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}