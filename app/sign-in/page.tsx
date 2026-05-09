"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
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
          <h1 className="font-heading text-2xl font-bold text-nyx-white mb-1">Sign in</h1>
          <p className="text-nyx-text text-sm mb-8">Welcome back to NyxEthos.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-nyx-text text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="w-full rounded-xl px-4 py-3 text-sm text-nyx-white placeholder:text-nyx-muted outline-none transition-all duration-200"
                style={{
                  background: "rgba(6,14,30,0.80)",
                  border: "1px solid rgba(37,112,245,0.22)",
                }}
                onFocus={(e) => (e.target.style.border = "1px solid rgba(77,143,255,0.60)")}
                onBlur={(e) => (e.target.style.border = "1px solid rgba(37,112,245,0.22)")}
              />
            </div>
            <div>
              <label className="block text-nyx-text text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm text-nyx-white placeholder:text-nyx-muted outline-none transition-all duration-200"
                style={{
                  background: "rgba(6,14,30,0.80)",
                  border: "1px solid rgba(37,112,245,0.22)",
                }}
                onFocus={(e) => (e.target.style.border = "1px solid rgba(77,143,255,0.60)")}
                onBlur={(e) => (e.target.style.border = "1px solid rgba(37,112,245,0.22)")}
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm rounded-lg px-3 py-2"
                style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full font-semibold text-sm text-white transition-all duration-300 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #2570f5 0%, #4d8fff 100%)",
                boxShadow: "0 0 30px rgba(37,112,245,0.35)",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-nyx-text text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-nyx-blue-bright hover:text-white transition-colors font-medium">
              Create one free
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
