"use client";

import { useState, useEffect, useRef } from "react";
import { X, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { useWaitlist } from "@/context/WaitlistContext";

export default function WaitlistModal() {
  const { isOpen, selectedPlan, close } = useWaitlist();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus first field when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setMessage("");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [close]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || status === "success") return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, plan: selectedPlan }),
      });
      const data = (await res.json()) as { message?: string; error?: string };

      if (res.ok) {
        setStatus("success");
        setMessage(data.message ?? "You're on the list!");
        setName("");
        setEmail("");
        setCompany("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error — please try again.");
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Join the NyxEthos waitlist"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-nyx-bg/80 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-md rounded-2xl border border-nyx-border bg-nyx-card shadow-[0_0_80px_rgba(29,111,232,0.18)] p-8 z-10">
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 text-nyx-muted hover:text-nyx-white transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {status === "success" ? (
          <div className="text-center py-6">
            <CheckCircle size={48} className="text-nyx-blue-bright mx-auto mb-4" />
            <h2 className="text-nyx-white text-xl font-bold mb-2">You&apos;re on the list!</h2>
            <p className="text-nyx-text text-sm mb-6">{message}</p>
            <button
              onClick={close}
              className="px-6 py-2.5 bg-nyx-blue hover:bg-nyx-blue-bright text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-nyx-border bg-nyx-bg text-nyx-blue-bright text-xs font-semibold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-nyx-blue-bright animate-pulse" />
                {selectedPlan ? `${selectedPlan} Plan` : "Early Access"}
              </div>
              <h2 className="text-nyx-white text-2xl font-bold tracking-tight mb-1">
                Start Your Free Trial
              </h2>
              <p className="text-nyx-muted text-sm">
                14 days free, no credit card required. We&apos;ll reach you at{" "}
                <span className="text-nyx-text">info@nyxethos.com</span> with next steps.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="wl-name" className="block text-xs font-medium text-nyx-text mb-1.5">
                  Your Name
                </label>
                <input
                  id="wl-name"
                  ref={inputRef}
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full rounded-lg bg-nyx-bg border border-nyx-border text-nyx-white placeholder:text-nyx-muted text-sm px-3.5 py-2.5 outline-none focus:border-nyx-blue focus:ring-1 focus:ring-nyx-blue transition-colors"
                />
              </div>

              <div>
                <label htmlFor="wl-email" className="block text-xs font-medium text-nyx-text mb-1.5">
                  Work Email <span className="text-nyx-blue-bright">*</span>
                </label>
                <input
                  id="wl-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="w-full rounded-lg bg-nyx-bg border border-nyx-border text-nyx-white placeholder:text-nyx-muted text-sm px-3.5 py-2.5 outline-none focus:border-nyx-blue focus:ring-1 focus:ring-nyx-blue transition-colors"
                />
              </div>

              <div>
                <label htmlFor="wl-company" className="block text-xs font-medium text-nyx-text mb-1.5">
                  Company
                </label>
                <input
                  id="wl-company"
                  type="text"
                  autoComplete="organization"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full rounded-lg bg-nyx-bg border border-nyx-border text-nyx-white placeholder:text-nyx-muted text-sm px-3.5 py-2.5 outline-none focus:border-nyx-blue focus:ring-1 focus:ring-nyx-blue transition-colors"
                />
              </div>

              {status === "error" && (
                <p className="text-red-400 text-xs px-1">{message}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-nyx-blue hover:bg-nyx-blue-bright disabled:opacity-60 text-white font-semibold text-sm transition-colors shadow-blue-glow"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Get Early Access
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-nyx-muted text-xs">
                No spam. Unsubscribe any time.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
