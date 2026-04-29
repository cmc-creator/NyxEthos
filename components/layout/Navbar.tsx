'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/services#pricing' },
  { label: 'Service Area', href: '/service-area' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#080f24]/95 backdrop-blur-md border-b border-[#1e3260]/60 shadow-lg shadow-black/30'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-14 h-14 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Auto-Docs Mobile Mechanic"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-black tracking-tight text-white">
                AUTO-<span className="text-[#e84c1a]">DOCS</span>
              </span>
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-widest font-medium -mt-0.5">
                Mobile Mechanic
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'text-[#e84c1a] bg-[#e84c1a]/10'
                    : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Phone */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+16025551234"
              className="flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors"
            >
              <Phone size={14} className="text-[#e84c1a]" />
              <span>(602) 555-1234</span>
            </a>
            <Link
              href="/booking"
              className="px-5 py-2.5 rounded-lg bg-[#e84c1a] hover:bg-[#ff6b35] text-white text-sm font-bold transition-all duration-200 glow-orange hover:scale-105"
            >
              Book Now
            </Link>
            <Link
              href="/login"
              className="px-4 py-2.5 rounded-lg border border-[#1e3260] hover:border-[#e84c1a]/50 text-[#94a3b8] hover:text-white text-sm font-medium transition-all duration-200"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-[#1e3260]/60 bg-[#080f24]/98 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-[#e84c1a] bg-[#e84c1a]/10'
                      : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-[#1e3260]/40 space-y-2">
                <a
                  href="tel:+16025551234"
                  className="flex items-center gap-2 px-4 py-3 text-sm text-[#94a3b8]"
                >
                  <Phone size={14} className="text-[#e84c1a]" />
                  (602) 555-1234
                </a>
                <Link
                  href="/booking"
                  className="block text-center px-4 py-3 rounded-lg bg-[#e84c1a] text-white text-sm font-bold"
                >
                  Book Now
                </Link>
                <Link
                  href="/login"
                  className="block text-center px-4 py-3 rounded-lg border border-[#1e3260] text-[#94a3b8] text-sm font-medium"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
