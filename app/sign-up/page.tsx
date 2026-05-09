"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", orgName: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password, orgName: form.orgName }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Registration failed.");
      setLoading(false);
      return;
    }
    // Auto sign-in after registration
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/dashboard");
    router.refresh();
  }

  const inputStyle = {
    background: "rgba(6,14,30,0.80)",
    border: "1px solid rgba(37,112,245,0.22)",
  };
  const inputClass = "w-full rounded-xl px-4 py-3 text-sm text-nyx-white placeholder:text-nyx-muted outline-none transition-all duration-200";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(180deg, #060e1e 0%, #081425 100%)" }}
    >
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/"><Logo /></Link>
        </div>

        <div className="rounded-2xl p-8" style={{
          background: "linear-gradient(145deg, rgba(22,52,106,0.95) 0%, rgba(12,28,62,0.98) 100%)",
          border: "1px solid rgba(37,112,245,0.28)",
          boxShadow: "0 0 60px rgba(37,112,245,0.15), 0 20px 40px rgba(0,0,0,0.4)",
        }}>
          <h1 className="font-heading text-2xl font-bold text-nyx-white mb-1">Create your account</h1>
          <p className="text-nyx-text text-sm mb-8">Set up NyxEthos for your organization - free for 14 days.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-nyx-text text-sm font-medium mb-1.5">Your name</label>
                <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
                  placeholder="Jane Smith" className={inputClass} style={inputStyle}
                  onFocus={(e) => (e.target.style.border = "1px solid rgba(77,143,255,0.60)")}
                  onBlur={(e) => (e.target.style.border = "1px solid rgba(37,112,245,0.22)")} />
              </div>
              <div>
                <label className="block text-nyx-text text-sm font-medium mb-1.5">Organization name</label>
                <input type="text" value={form.orgName} onChange={(e) => set("orgName", e.target.value)}
                  required placeholder="Acme Corp" className={inputClass} style={inputStyle}
                  onFocus={(e) => (e.target.style.border = "1px solid rgba(77,143,255,0.60)")}
                  onBlur={(e) => (e.target.style.border = "1px solid rgba(37,112,245,0.22)")} />
              </div>
            </div>
            <div>
              <label className="block text-nyx-text text-sm font-medium mb-1.5">Work email</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                required placeholder="you@company.com" className={inputClass} style={inputStyle}
                onFocus={(e) => (e.target.style.border = "1px solid rgba(77,143,255,0.60)")}
                onBlur={(e) => (e.target.style.border = "1px solid rgba(37,112,245,0.22)")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-nyx-text text-sm font-medium mb-1.5">Password</label>
                <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)}
                  required placeholder="8+ characters" className={inputClass} style={inputStyle}
                  onFocus={(e) => (e.target.style.border = "1px solid rgba(77,143,255,0.60)")}
                  onBlur={(e) => (e.target.style.border = "1px solid rgba(37,112,245,0.22)")} />
              </div>
              <div>
                <label className="block text-nyx-text text-sm font-medium mb-1.5">Confirm</label>
                <input type="password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)}
                  required placeholder="Repeat password" className={inputClass} style={inputStyle}
                  onFocus={(e) => (e.target.style.border = "1px solid rgba(77,143,255,0.60)")}
                  onBlur={(e) => (e.target.style.border = "1px solid rgba(37,112,245,0.22)")} />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm rounded-lg px-3 py-2"
                style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)" }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-full font-semibold text-sm text-white transition-all duration-300 mt-2 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #2570f5 0%, #4d8fff 100%)",
                boxShadow: "0 0 30px rgba(37,112,245,0.35)",
              }}
            >
              {loading ? "Creating account..." : "Create account - free"}
            </button>
          </form>

          <p className="text-center text-nyx-text text-sm mt-6">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-nyx-blue-bright hover:text-white transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-nyx-muted text-xs mt-6">
          <Link href="/" className="hover:text-nyx-text transition-colors">&larr; Back to home</Link>
        </p>
      </div>
    </div>
  );
}
