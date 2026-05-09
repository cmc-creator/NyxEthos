"use client";

import { useState, useEffect } from "react";
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
          ? "glass border-b border-nyx-border shadow-[0_0_30px_rgba(37,112,245,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <Logo />
        </a>

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

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/dashboard"
            className="text-xs font-medium text-nyx-muted hover:text-nyx-white transition-colors tracking-wide"
          >
            Sign In
          </a>
          <button
            onClick={() => open()}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-nyx-blue to-nyx-blue-bright hover:from-nyx-blue-bright hover:to-nyx-blue text-white text-xs font-semibold transition-all duration-300 shadow-btn-primary hover:shadow-btn-primary-hover tracking-wide"
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
        <div className="md:hidden glass border-t border-nyx-border px-6 py-4 flex flex-col gap-4">
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
            onClick={() => { open(); setMenuOpen(false); }}
            className="mt-2 px-4 py-2.5 rounded-lg bg-nyx-blue hover:bg-nyx-blue-bright text-white text-sm font-semibold transition-colors text-center"
          >
            Start Free Trial
          </button>
        </div>
      )}
    </header>
  );
}
