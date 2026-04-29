'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Wrench,
  Zap,
  Droplets,
  Thermometer,
  Battery,
  CircleDot,
  Gauge,
  ShieldCheck,
  Star,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Activity,
  Users,
  Award,
  TrendingUp,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────── */
/* Animated counter                                          */
/* ──────────────────────────────────────────────────────── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ──────────────────────────────────────────────────────── */
/* Data                                                       */
/* ──────────────────────────────────────────────────────── */
const services = [
  {
    icon: Droplets,
    title: 'Oil Change',
    desc: 'Conventional, synthetic blend, or full synthetic at your location.',
    from: 39,
    color: '#f59e0b',
    id: 'oil-change',
  },
  {
    icon: CircleDot,
    title: 'Brake Service',
    desc: 'Pad replacement, rotor resurfacing, and full brake system inspection.',
    from: 120,
    color: '#e84c1a',
    id: 'brakes',
  },
  {
    icon: Gauge,
    title: 'Diagnostics',
    desc: 'Full OBD-II scan, check engine light, sensor and computer analysis.',
    from: 65,
    color: '#6366f1',
    id: 'diagnostics',
  },
  {
    icon: Battery,
    title: 'Battery Replacement',
    desc: 'Test, replace, and dispose of battery — all brands in stock.',
    from: 95,
    color: '#10b981',
    id: 'battery',
  },
  {
    icon: Thermometer,
    title: 'AC & Heating',
    desc: 'Recharge, leak detection, compressor, heater core, and more.',
    from: 85,
    color: '#3b82f6',
    id: 'ac-heating',
  },
  {
    icon: Zap,
    title: 'Electrical',
    desc: 'Starters, alternators, wiring, lights, and full electrical diagnosis.',
    from: 75,
    color: '#eab308',
    id: 'electrical',
  },
];

const steps = [
  {
    num: '01',
    title: 'Choose Your Service',
    desc: 'Browse our clear pricing menu and pick the service your vehicle needs.',
    icon: Wrench,
  },
  {
    num: '02',
    title: 'Pick a Time & Location',
    desc: 'Select a day, time, and tell us where to find you — home, office, or roadside.',
    icon: Clock,
  },
  {
    num: '03',
    title: 'We Come to You',
    desc: 'A certified mechanic arrives on time in our equipped service van, fully stocked.',
    icon: MapPin,
  },
];

const testimonials = [
  {
    name: 'Marcus T.',
    location: 'Phoenix, AZ',
    stars: 5,
    text: "Auto-Docs saved me from missing a day of work. They came to my office parking garage, changed my brakes in 45 minutes, and the price was better than any shop I've called. Absolutely blown away.",
  },
  {
    name: 'Adriana R.',
    location: 'Scottsdale, AZ',
    stars: 5,
    text: 'My check engine light came on during a road trip. I called Auto-Docs and they were at my location within the hour. They diagnosed the issue on the spot and had me back on the road same day.',
  },
  {
    name: 'Derek W.',
    location: 'Mesa, AZ',
    stars: 5,
    text: "Used Auto-Docs three times now — oil change, battery, and AC recharge. Every time they're on time, professional, and transparent about cost. This is the future of car repair.",
  },
  {
    name: 'Cassandra L.',
    location: 'Chandler, AZ',
    stars: 5,
    text: "As a single mom, it's hard to find time for car maintenance. Auto-Docs came to my home on a Saturday morning. My kids played in the backyard while my car got serviced. 10/10.",
  },
];

const badges = [
  { icon: ShieldCheck, label: 'Licensed & Insured' },
  { icon: Award, label: 'ASE Certified' },
  { icon: Star, label: '5-Star Rated' },
  { icon: TrendingUp, label: '3+ Years Serving AZ' },
];

/* ──────────────────────────────────────────────────────── */
/* Fade-in wrapper                                           */
/* ──────────────────────────────────────────────────────── */
function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const dirs = {
    up: { y: 32, x: 0 },
    down: { y: -32, x: 0 },
    left: { y: 0, x: 32 },
    right: { y: 0, x: -32 },
    none: { y: 0, x: 0 },
  };
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...dirs[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────── */
/* Main page                                                 */
/* ──────────────────────────────────────────────────────── */
export default function HeroAndSections() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden hex-pattern">
        {/* Radial glow overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full opacity-25"
            style={{
              background:
                'radial-gradient(circle, rgba(30,58,110,0.8) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full opacity-20"
            style={{
              background:
                'radial-gradient(circle, rgba(232,76,26,0.8) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Gear decoration */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
          className="absolute top-24 right-[5%] opacity-5 hidden lg:block"
          style={{ fontSize: 220 }}
        >
          ⚙️
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
          className="absolute bottom-10 left-[3%] opacity-5 hidden lg:block"
          style={{ fontSize: 160 }}
        >
          ⚙️
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e84c1a]/10 border border-[#e84c1a]/30 text-[#e84c1a] text-xs font-bold uppercase tracking-widest mb-6"
              >
                <Activity size={12} />
                Arizona&apos;s #1 Mobile Mechanic
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-6"
              >
                <span className="text-white">Your Car</span>
                <br />
                <span className="text-white">Fixed</span>{' '}
                <span className="gradient-text text-glow-orange">Anywhere</span>
                <br />
                <span className="text-white">in Arizona</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-lg text-[#94a3b8] leading-relaxed mb-8 max-w-xl"
              >
                Auto-Docs brings the repair shop to your driveway, office, or roadside.
                Certified mechanics. Transparent pricing. No appointments at a shop — ever.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap gap-4 mb-10"
              >
                <Link
                  href="/booking"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#e84c1a] hover:bg-[#ff6b35] text-white font-bold text-lg transition-all duration-200 glow-orange hover:scale-105"
                >
                  Book Now — It's Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-[#1e3260] hover:border-[#e84c1a]/60 text-white font-semibold text-lg transition-all duration-200 hover:bg-[#e84c1a]/5"
                >
                  Get a Quote
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3"
              >
                {badges.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 text-xs text-[#94a3b8]"
                  >
                    <Icon size={13} className="text-[#e84c1a]" />
                    {label}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: logo + floating cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                {/* Glow ring */}
                <div className="absolute inset-4 rounded-full border-2 border-[#e84c1a]/20 animate-pulse" />
                <div className="absolute inset-0 rounded-full" style={{
                  background: 'radial-gradient(circle, rgba(30,58,110,0.4) 0%, transparent 70%)'
                }} />
                <Image
                  src="/logo.png"
                  alt="Auto-Docs Mobile Mechanic"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Floating card: Live booking */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute top-4 -left-4 glass-card rounded-2xl px-4 py-3 flex items-center gap-3"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <div>
                  <div className="text-[10px] text-[#7a8fb5]">Available Today</div>
                  <div className="text-sm font-bold text-white">3 slots open</div>
                </div>
              </motion.div>

              {/* Floating card: Rating */}
              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="absolute bottom-8 -right-2 glass-card rounded-2xl px-4 py-3"
              >
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={11} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <div className="text-[10px] text-[#7a8fb5]">200+ happy customers</div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 70 900 0 720 20C540 40 240 -10 0 20L0 60Z" fill="#080f24" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────── */}
      <section className="bg-[#e84c1a] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { icon: Users, target: 200, suffix: '+', label: 'Happy Customers' },
              { icon: Wrench, target: 15, suffix: '+', label: 'Services Offered' },
              { icon: Clock, target: 60, suffix: 'min', label: 'Avg. Service Time' },
              { icon: MapPin, target: 20, suffix: '+', label: 'Arizona Cities Served' },
            ].map(({ icon: Icon, target, suffix, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon size={22} className="text-white/60 mb-1" />
                <span className="text-3xl sm:text-4xl font-black text-white">
                  <Counter target={target} suffix={suffix} />
                </span>
                <span className="text-white/70 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────── */}
      <section className="py-24 bg-[#080f24] hex-pattern" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#e84c1a]/10 border border-[#e84c1a]/30 text-[#e84c1a] text-xs font-bold uppercase tracking-widest mb-4">
              What We Fix
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-2 mb-4">
              Full-Service Auto Repair
              <br />
              <span className="gradient-text">At Your Location</span>
            </h2>
            <p className="text-[#7a8fb5] text-lg max-w-2xl mx-auto">
              From quick oil changes to complex diagnostics — we handle it all in your
              driveway. No towing, no waiting rooms.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <FadeIn key={svc.id} delay={i * 0.07}>
                  <div className="group relative glass-card rounded-2xl p-6 hover:border-[#e84c1a]/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer">
                    {/* bg glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 50% 0%, ${svc.color}15 0%, transparent 70%)`,
                      }}
                    />
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${svc.color}20` }}
                    >
                      <Icon size={22} style={{ color: svc.color }} />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{svc.title}</h3>
                    <p className="text-[#7a8fb5] text-sm leading-relaxed mb-4">{svc.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#94a3b8]">
                        Starting at{' '}
                        <span className="text-white font-bold">${svc.from}</span>
                      </span>
                      <Link
                        href={`/services#${svc.id}`}
                        className="flex items-center gap-1 text-xs font-semibold transition-colors"
                        style={{ color: svc.color }}
                      >
                        Details <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn className="text-center mt-10" delay={0.3}>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#1e3260]/60 hover:bg-[#1e3260] border border-[#1e3260] hover:border-[#e84c1a]/50 text-white font-semibold transition-all duration-200"
            >
              View All Services & Pricing
              <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-24 bg-[#0a1328]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#e84c1a]/10 border border-[#e84c1a]/30 text-[#e84c1a] text-xs font-bold uppercase tracking-widest mb-4">
              How It Works
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-2 mb-4">
              3 Steps to a
              <br />
              <span className="gradient-text">Fixed Vehicle</span>
            </h2>
            <p className="text-[#7a8fb5] text-lg max-w-xl mx-auto">
              The simplest car repair experience you&apos;ve ever had.
            </p>
          </FadeIn>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-16 left-[16.5%] right-[16.5%] h-0.5 bg-gradient-to-r from-[#1e3260] via-[#e84c1a] to-[#1e3260]" />

            <div className="grid lg:grid-cols-3 gap-10">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <FadeIn key={step.num} delay={i * 0.12} direction="up">
                    <div className="relative text-center">
                      <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-[#0f1e3d] border-2 border-[#1e3260] mb-6 mx-auto">
                        <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#e84c1a] text-white text-xs font-black flex items-center justify-center">
                          {i + 1}
                        </span>
                        <Icon size={32} className="text-[#e84c1a]" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                      <p className="text-[#7a8fb5] leading-relaxed">{step.desc}</p>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>

          <FadeIn className="text-center mt-14">
            <Link
              href="/booking"
              className="group inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-[#e84c1a] hover:bg-[#ff6b35] text-white font-bold text-lg transition-all duration-200 glow-orange hover:scale-105"
            >
              Schedule Your Visit
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────── */}
      <section className="py-24 bg-[#080f24] hex-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <FadeIn direction="right">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#e84c1a]/10 border border-[#e84c1a]/30 text-[#e84c1a] text-xs font-bold uppercase tracking-widest mb-4">
                Why Auto-Docs
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white mt-2 mb-6">
                The Smarter Way
                <br />
                <span className="gradient-text">to Fix Your Car</span>
              </h2>
              <p className="text-[#7a8fb5] text-lg leading-relaxed mb-8">
                Forget tow trucks and waiting rooms. Auto-Docs puts a certified mechanic
                at your location with everything needed to get your car running right —
                quickly and affordably.
              </p>
              <div className="space-y-4">
                {[
                  'No shop overhead — you save money directly',
                  'Real-time updates via text and email',
                  'Transparent flat-rate pricing before we start',
                  'Warranty on all parts and labor',
                  'Fully stocked service van at every visit',
                  'Available 7 days a week across all of Greater Phoenix',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#e84c1a] flex-shrink-0" />
                    <span className="text-[#94a3b8]">{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.1}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '$0', label: 'Hidden Fees', sub: 'Price you\'re quoted = price you pay' },
                  { value: '1hr', label: 'Average Response', sub: 'From booking to mechanic on-site' },
                  { value: '100%', label: 'Satisfaction Rate', sub: 'We make it right, guaranteed' },
                  { value: '24hr', label: 'Parts Warranty', sub: 'Min 90-day warranty on all parts' },
                ].map(({ value, label, sub }) => (
                  <div
                    key={label}
                    className="glass-card rounded-2xl p-6 text-center hover:border-[#e84c1a]/40 transition-colors"
                  >
                    <div className="text-3xl font-black text-[#e84c1a] mb-1">{value}</div>
                    <div className="text-white font-semibold text-sm mb-1">{label}</div>
                    <div className="text-[#7a8fb5] text-xs leading-relaxed">{sub}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="py-24 bg-[#0a1328]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#e84c1a]/10 border border-[#e84c1a]/30 text-[#e84c1a] text-xs font-bold uppercase tracking-widest mb-4">
              What Customers Say
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-2 mb-4">
              Real Reviews from
              <br />
              <span className="gradient-text">Real Arizonans</span>
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.08}>
                <div className="glass-card rounded-2xl p-6 h-full flex flex-col hover:border-[#e84c1a]/30 transition-colors">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} size={14} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-[#94a3b8] text-sm leading-relaxed flex-1 mb-4 line-clamp-3">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div>
                    <div className="text-white font-bold text-sm">{t.name}</div>
                    <div className="text-[#7a8fb5] text-xs flex items-center gap-1 mt-0.5">
                      <MapPin size={10} />
                      {t.location}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0f1e3d 0%, #1e3a6e 50%, #0f1e3d 100%)',
          }}
        />
        <div className="absolute inset-0 hex-pattern opacity-40" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(232,76,26,0.15) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <FadeIn>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#e84c1a]/20 border border-[#e84c1a]/40 text-[#e84c1a] text-xs font-bold uppercase tracking-widest mb-6">
              Ready to Get Started?
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
              Stop Waiting at the Shop.
              <br />
              <span className="gradient-text">We Come to You.</span>
            </h2>
            <p className="text-[#94a3b8] text-lg mb-10 max-w-xl mx-auto">
              Book your appointment in 60 seconds. A certified Auto-Docs mechanic will be
              at your location today or tomorrow.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/booking"
                className="group inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-[#e84c1a] hover:bg-[#ff6b35] text-white font-black text-lg transition-all duration-200 glow-orange hover:scale-105"
              >
                Book Now — It&apos;s Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+16025551234"
                className="inline-flex items-center gap-2 px-10 py-5 rounded-xl border-2 border-white/20 hover:border-white/40 text-white font-bold text-lg transition-all duration-200 hover:bg-white/5"
              >
                <Phone size={18} />
                Call (602) 555-1234
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
