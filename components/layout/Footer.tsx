import Image from 'next/image';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Wrench,
  Shield,
  Star,
} from 'lucide-react';

function FacebookIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const serviceLinks = [
  { label: 'Oil Change', href: '/services#oil-change' },
  { label: 'Brake Repair', href: '/services#brakes' },
  { label: 'Diagnostics', href: '/services#diagnostics' },
  { label: 'Battery Replacement', href: '/services#battery' },
  { label: 'AC / Heating', href: '/services#ac-heating' },
  { label: 'Tire Services', href: '/services#tires' },
];

const quickLinks = [
  { label: 'Book Appointment', href: '/booking' },
  { label: 'Get a Quote', href: '/contact' },
  { label: 'Service Area', href: '/service-area' },
  { label: 'Pricing', href: '/services#pricing' },
  { label: 'Customer Portal', href: '/dashboard' },
  { label: 'About Us', href: '/about' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#060c1c] border-t border-[#1e3260]/50 mt-auto">
      {/* Top bar */}
      <div className="bg-[#e84c1a] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-white text-sm font-semibold">
            <Clock size={14} />
            <span>Mon–Sat 7AM–7PM &nbsp;|&nbsp; Sun 9AM–4PM</span>
          </div>
          <a
            href="tel:+16025551234"
            className="flex items-center gap-2 text-white font-bold text-sm hover:underline"
          >
            <Phone size={14} />
            (602) 555-1234 — Call or Text
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-14 h-14 flex-shrink-0">
                <Image src="/logo.png" alt="Auto-Docs" fill className="object-contain" />
              </div>
              <div>
                <span className="text-xl font-black text-white">
                  AUTO-<span className="text-[#e84c1a]">DOCS</span>
                </span>
                <p className="text-[10px] text-[#94a3b8] uppercase tracking-widest">Mobile Mechanic</p>
              </div>
            </div>
            <p className="text-[#7a8fb5] text-sm leading-relaxed mb-5">
              Arizona's most trusted mobile mechanic. We bring professional auto repair
              directly to your home, office, or roadside — no shop visit needed.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#1e3260]/60 hover:bg-[#e84c1a] flex items-center justify-center text-[#94a3b8] hover:text-white transition-all duration-200"
              >
                <FacebookIcon size={15} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#1e3260]/60 hover:bg-[#e84c1a] flex items-center justify-center text-[#94a3b8] hover:text-white transition-all duration-200"
              >
                <InstagramIcon size={15} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <Wrench size={14} className="text-[#e84c1a]" />
              Services
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#7a8fb5] hover:text-[#e84c1a] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <Shield size={14} className="text-[#e84c1a]" />
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#7a8fb5] hover:text-[#e84c1a] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <MapPin size={14} className="text-[#e84c1a]" />
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+16025551234"
                  className="flex items-start gap-3 text-sm text-[#7a8fb5] hover:text-white transition-colors"
                >
                  <Phone size={14} className="text-[#e84c1a] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">(602) 555-1234</div>
                    <div className="text-xs">Call or Text</div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:service@autodocs-az.com"
                  className="flex items-start gap-3 text-sm text-[#7a8fb5] hover:text-white transition-colors"
                >
                  <Mail size={14} className="text-[#e84c1a] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">service@autodocs-az.com</div>
                    <div className="text-xs">Email us anytime</div>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-[#e84c1a] mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="text-white font-medium">Greater Phoenix Area</div>
                  <div className="text-[#7a8fb5] text-xs">
                    Serving Phoenix, Scottsdale, Mesa, Tempe, Chandler, Gilbert & more
                  </div>
                </div>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-xl bg-[#0f1e3d]/60 border border-[#1e3260]/40">
              <div className="flex items-center gap-2 mb-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-[#7a8fb5] ml-1">5.0</span>
              </div>
              <p className="text-xs text-[#94a3b8]">Rated 5 stars by 200+ Arizona customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1e3260]/30 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#7a8fb5] text-xs">
            © {year} Auto-Docs Mobile Mechanic. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#7a8fb5]">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span className="text-[#1e3260]">|</span>
            <span>Licensed & Insured in Arizona</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
