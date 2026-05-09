"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { useWaitlist } from "@/context/WaitlistContext";

const navLinks = [
  { label: "Modules", href: "#modules" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { open } = useWaitlist();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-nyx-border shadow-[0_0_40px_rgba(124,58,237,0.08)]"
          : "bg-transparent"
      }`}
      style={
        scrolled
          ? {
              background: "rgba(6,7,15,0.88)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
            }
          : {}
      }
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-nyx-muted hover:text-nyx-white text-xs font-medium transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/dashboard"
            className="text-xs font-medium text-nyx-muted hover:text-nyx-white transition-colors tracking-wide"
          >
            Sign In
          </a>
          <button
            onClick={() => open()}
            className="px-5 py-2.5 rounded-full text-white text-xs font-semibold transition-all duration-300 tracking-wide hover:-translate-y-0.5"
            style={{
              background:
                "linear-gradient(135deg, #1e5fe8 0%, #7c3aed 100%)",
              boxShadow:
                "0 4px 20px rgba(124,58,237,0.40), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            Start Free Trial
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-nyx-text hover:text-nyx-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t border-nyx-border px-6 py-4 flex flex-col gap-4"
          style={{
            background: "rgba(6,7,15,0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-nyx-text hover:text-nyx-white text-sm font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              open();
              setMenuOpen(false);
            }}
            className="mt-2 px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-colors text-center"
            style={{
              background: "linear-gradient(135deg, #1e5fe8, #7c3aed)",
            }}
          >
            Start Free Trial
          </button>
        </div>
      )}
    </header>
  );
}

