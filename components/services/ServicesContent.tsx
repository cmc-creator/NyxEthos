'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import {
  Droplets,
  CircleDot,
  Gauge,
  Battery,
  Thermometer,
  Zap,
  Wrench,
  Car,
  CheckCircle2,
  ArrowRight,
  Phone,
  Shield,
  Clock,
  Star,
} from 'lucide-react';

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const categories = [
  {
    id: 'oil-change',
    icon: Droplets,
    color: '#f59e0b',
    title: 'Oil Change Services',
    desc: 'Regular oil changes are the #1 way to protect your engine. We stock all viscosity grades.',
    services: [
      { name: 'Conventional Oil Change', price: 39, time: 30, what: 'Up to 5 qts conventional oil + filter' },
      { name: 'Synthetic Blend Oil Change', price: 55, time: 30, what: 'Up to 5 qts synthetic blend + filter' },
      { name: 'Full Synthetic Oil Change', price: 75, time: 30, what: 'Up to 5 qts full synthetic + filter' },
      { name: 'High Mileage Oil Change', price: 80, time: 35, what: 'High mileage formula (75k+ miles)' },
      { name: 'Diesel Oil Change', price: 110, time: 45, what: 'Up to 10 qts diesel-grade oil + filter' },
    ],
  },
  {
    id: 'brakes',
    icon: CircleDot,
    color: '#e84c1a',
    title: 'Brake Services',
    desc: 'Your safety depends on your brakes. We inspect, service, and repair the full brake system.',
    services: [
      { name: 'Brake Inspection', price: 0, time: 20, what: 'Full brake system visual & functional check (FREE with service)' },
      { name: 'Front Brake Pad Replacement', price: 120, time: 60, what: 'Pads + hardware; rotors checked' },
      { name: 'Rear Brake Pad Replacement', price: 110, time: 60, what: 'Pads + hardware; rotors checked' },
      { name: 'Front & Rear Brake Pads', price: 210, time: 90, what: 'Both axles — best value' },
      { name: 'Rotor Resurfacing (per axle)', price: 65, time: 30, what: 'Machined on-site when possible' },
      { name: 'Rotor Replacement (per axle)', price: 160, time: 60, what: 'New OEM-spec rotors + pads' },
      { name: 'Brake Fluid Flush', price: 90, time: 30, what: 'Full system bleed with DOT fluid' },
    ],
  },
  {
    id: 'diagnostics',
    icon: Gauge,
    color: '#6366f1',
    title: 'Diagnostics',
    desc: 'We use factory-grade scan tools to read codes and pinpoint exactly what\'s wrong.',
    services: [
      { name: 'Check Engine Light Scan', price: 65, time: 30, what: 'OBD-II scan, code pull, and explanation' },
      { name: 'Full Vehicle Diagnostic', price: 120, time: 75, what: 'All systems: engine, trans, ABS, TPMS, HVAC' },
      { name: 'Pre-Purchase Inspection', price: 150, time: 90, what: 'Full inspection before buying a used vehicle' },
      { name: 'Electrical Diagnosis', price: 95, time: 60, what: 'Short/open circuit tracing, sensor testing' },
      { name: 'TPMS Reset / Relearn', price: 45, time: 20, what: 'Tire pressure sensor programming' },
    ],
  },
  {
    id: 'battery',
    icon: Battery,
    color: '#10b981',
    title: 'Battery Services',
    desc: 'Dead battery? We test, replace, and dispose — right where you are.',
    services: [
      { name: 'Battery Test', price: 0, time: 10, what: 'Load test, CCA check (FREE)' },
      { name: 'Standard Battery Replacement', price: 95, time: 20, what: 'Includes new battery (group fit)' },
      { name: 'AGM / Start-Stop Battery', price: 175, time: 30, what: 'Advanced AGM battery + registration' },
      { name: 'Battery Terminal Cleaning', price: 25, time: 15, what: 'Remove corrosion, protect terminals' },
      { name: 'Jump Start', price: 45, time: 15, what: 'Roadside battery boost service' },
    ],
  },
  {
    id: 'ac-heating',
    icon: Thermometer,
    color: '#3b82f6',
    title: 'AC & Heating',
    desc: 'Arizona heat is no joke. We recharge, diagnose, and repair your entire climate system.',
    services: [
      { name: 'AC Recharge (R134a)', price: 85, time: 45, what: 'Vacuum, charge to spec, leak check' },
      { name: 'AC Performance Check', price: 65, time: 30, what: 'Temp readings, pressure test, full inspection' },
      { name: 'Cabin Air Filter Replace', price: 35, time: 15, what: 'Filter provided + install' },
      { name: 'AC Compressor Inspection', price: 95, time: 45, what: 'Clutch, pressure, refrigerant diagnosis' },
      { name: 'Heater Core Flush', price: 120, time: 60, what: 'Restore heat output; flush deposits' },
      { name: 'Thermostat Replacement', price: 130, time: 60, what: 'Thermostat + housing + coolant top-off' },
    ],
  },
  {
    id: 'electrical',
    icon: Zap,
    color: '#eab308',
    title: 'Electrical Services',
    desc: 'From starter motors to wiring harnesses — we troubleshoot and fix it all.',
    services: [
      { name: 'Alternator Replacement', price: 220, time: 90, what: 'New alternator + belt check' },
      { name: 'Starter Replacement', price: 200, time: 90, what: 'New starter motor installed' },
      { name: 'Headlight / Bulb Replace (pair)', price: 55, time: 20, what: 'Halogen, LED, or HID bulbs available' },
      { name: 'Fuse Diagnosis & Repair', price: 55, time: 30, what: 'Fuse box inspection, fuse/relay swap' },
      { name: 'Power Window Repair', price: 95, time: 45, what: 'Regulator, motor, switch diagnosis' },
    ],
  },
];

export default function ServicesContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden hex-pattern">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top, rgba(30,58,110,0.5) 0%, transparent 60%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#e84c1a]/10 border border-[#e84c1a]/30 text-[#e84c1a] text-xs font-bold uppercase tracking-widest mb-5">
              Transparent Pricing
            </span>
            <h1 className="text-5xl sm:text-6xl font-black text-white mb-5">
              Services &amp;{' '}
              <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto mb-8">
              No surprises. No hidden fees. Every price listed is what you pay —
              all service performed at your location.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {[
                { icon: Shield, text: 'All work guaranteed' },
                { icon: Clock, text: 'Same-day service available' },
                { icon: Star, text: '5-star rated' },
                { icon: Car, text: 'We come to you' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-[#94a3b8]">
                  <Icon size={14} className="text-[#e84c1a]" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category nav */}
      <div className="sticky top-20 z-30 bg-[#080f24]/95 backdrop-blur-md border-b border-[#1e3260]/50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-[#7a8fb5] hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap"
                >
                  <Icon size={12} style={{ color: cat.color }} />
                  {cat.title.split(' ')[0]}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Service categories */}
      <div className="py-16 bg-[#080f24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {categories.map((cat, ci) => {
            const Icon = cat.icon;
            return (
              <FadeIn key={cat.id} delay={0.05} className="scroll-mt-32">
                <div id={cat.id} className="scroll-mt-32">
                  {/* Category header */}
                  <div className="flex items-start gap-4 mb-8">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cat.color}20` }}
                    >
                      <Icon size={26} style={{ color: cat.color }} />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">{cat.title}</h2>
                      <p className="text-[#7a8fb5]">{cat.desc}</p>
                    </div>
                  </div>

                  {/* Service rows */}
                  <div className="rounded-2xl border border-[#1e3260]/50 overflow-hidden">
                    <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-[#0f1e3d]/60 border-b border-[#1e3260]/50 text-xs font-semibold uppercase tracking-widest text-[#7a8fb5]">
                      <span className="col-span-5">Service</span>
                      <span className="col-span-4">What&apos;s Included</span>
                      <span className="col-span-1 text-center">Time</span>
                      <span className="col-span-2 text-right">Price</span>
                    </div>
                    {cat.services.map((svc, si) => (
                      <div
                        key={svc.name}
                        className={`grid sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-5 items-center border-b border-[#1e3260]/30 last:border-0 hover:bg-[#0f1e3d]/40 transition-colors ${
                          si % 2 === 0 ? 'bg-[#080f24]' : 'bg-[#0a1328]/40'
                        }`}
                      >
                        <div className="sm:col-span-5 flex items-center gap-3">
                          <CheckCircle2 size={14} style={{ color: cat.color }} className="flex-shrink-0" />
                          <span className="text-white font-semibold">{svc.name}</span>
                          {svc.price === 0 && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold text-green-400 bg-green-400/10">FREE</span>
                          )}
                        </div>
                        <p className="sm:col-span-4 text-[#7a8fb5] text-sm">{svc.what}</p>
                        <div className="sm:col-span-1 text-center">
                          <span className="inline-flex items-center gap-1 text-xs text-[#94a3b8]">
                            <Clock size={10} />
                            ~{svc.time}m
                          </span>
                        </div>
                        <div className="sm:col-span-2 text-right">
                          <span className="text-xl font-black" style={{ color: cat.color }}>
                            {svc.price === 0 ? 'FREE' : `$${svc.price}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* Additional services note */}
      <section className="py-16 bg-[#0a1328]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <FadeIn>
            <div className="glass-card rounded-2xl p-10">
              <Wrench size={36} className="text-[#e84c1a] mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white mb-3">Don't See Your Service?</h3>
              <p className="text-[#7a8fb5] mb-6 max-w-xl mx-auto">
                We handle much more than what's listed. Engine work, transmission diagnostics,
                suspension, exhaust, fuel systems, and more. Call or send us a message — we'll
                give you an honest quote within the hour.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#e84c1a] text-white font-bold text-sm transition-all hover:bg-[#ff6b35] hover:scale-105"
                >
                  Request a Custom Quote
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="tel:+16025551234"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-[#1e3260] text-white font-semibold text-sm transition-all hover:border-[#e84c1a]/50"
                >
                  <Phone size={15} />
                  (602) 555-1234
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#080f24]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Ready to Book?
            </h2>
            <p className="text-[#7a8fb5] mb-8">
              Choose your service, pick a time, and we'll come to you. Same-day appointments available.
            </p>
            <Link
              href="/booking"
              className="group inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-[#e84c1a] hover:bg-[#ff6b35] text-white font-bold text-lg glow-orange hover:scale-105 transition-all"
            >
              Book an Appointment
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
