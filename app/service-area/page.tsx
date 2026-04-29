import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MapPin, CheckCircle2, Phone, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Service Area | Auto-Docs Mobile Mechanic Arizona',
  description:
    'Auto-Docs serves all of Greater Phoenix including Scottsdale, Mesa, Tempe, Chandler, Gilbert, Glendale, and more.',
};

const cities = [
  { name: 'Phoenix', zip: '85001', highlight: true },
  { name: 'Scottsdale', zip: '85251', highlight: true },
  { name: 'Mesa', zip: '85201', highlight: true },
  { name: 'Tempe', zip: '85281', highlight: true },
  { name: 'Chandler', zip: '85224', highlight: true },
  { name: 'Gilbert', zip: '85296', highlight: true },
  { name: 'Glendale', zip: '85301', highlight: false },
  { name: 'Peoria', zip: '85345', highlight: false },
  { name: 'Surprise', zip: '85374', highlight: false },
  { name: 'Avondale', zip: '85323', highlight: false },
  { name: 'Goodyear', zip: '85338', highlight: false },
  { name: 'Queen Creek', zip: '85142', highlight: false },
  { name: 'San Tan Valley', zip: '85143', highlight: false },
  { name: 'Fountain Hills', zip: '85268', highlight: false },
  { name: 'Cave Creek', zip: '85331', highlight: false },
  { name: 'Paradise Valley', zip: '85253', highlight: false },
  { name: 'Ahwatukee', zip: '85044', highlight: false },
  { name: 'Sun City', zip: '85351', highlight: false },
  { name: 'Buckeye', zip: '85326', highlight: false },
  { name: 'Apache Junction', zip: '85120', highlight: false },
];

export default function ServiceAreaPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-20 min-h-screen hex-pattern">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#e84c1a]/10 border border-[#e84c1a]/30 text-[#e84c1a] text-xs font-bold uppercase tracking-widest mb-4">
            Where We Serve
          </span>
          <h1 className="text-5xl font-black text-white mb-4">
            Service Area —{' '}
            <span className="gradient-text">Greater Phoenix</span>
          </h1>
          <p className="text-[#7a8fb5] text-lg max-w-xl mx-auto">
            We travel across the entire Valley. If your ZIP code isn't listed, give us a call —
            we'll often make exceptions for nearby areas.
          </p>
        </div>

        {/* Arizona map placeholder + city grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Map visual */}
          <div className="glass-card rounded-3xl overflow-hidden h-96 flex items-center justify-center relative">
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #0f1e3d 0%, #162347 50%, #0f1e3d 100%)',
              }}
            />
            <div className="absolute inset-0 hex-pattern opacity-30" />
            {/* Simulated map dots */}
            <div className="relative text-center z-10">
              <div className="w-20 h-20 rounded-full bg-[#e84c1a]/20 border-2 border-[#e84c1a]/50 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <MapPin size={32} className="text-[#e84c1a]" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Greater Phoenix, Arizona</h3>
              <p className="text-[#7a8fb5] text-sm max-w-sm mx-auto">
                We cover a 50-mile radius from central Phoenix. Call us for exact coverage in your area.
              </p>
              <a
                href="tel:+16025551234"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl bg-[#e84c1a]/20 border border-[#e84c1a]/40 text-[#e84c1a] text-sm font-bold"
              >
                <Phone size={14} />
                (602) 555-1234
              </a>
            </div>
          </div>

          {/* City grid */}
          <div>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-[#e84c1a]" />
              Cities We Serve
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {cities.map((city) => (
                <div
                  key={city.name}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                    city.highlight
                      ? 'border-[#e84c1a]/40 bg-[#e84c1a]/5'
                      : 'border-[#1e3260]/50 bg-[#0f1e3d]/40'
                  }`}
                >
                  <CheckCircle2
                    size={14}
                    className={city.highlight ? 'text-[#e84c1a]' : 'text-green-400'}
                  />
                  <div>
                    <div className="text-white text-sm font-semibold">{city.name}</div>
                    <div className="text-[#7a8fb5] text-xs">{city.zip}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hours + CTA */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-7">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Clock size={18} className="text-[#e84c1a]" />
                Hours of Operation
              </h3>
              <div className="space-y-2">
                {[
                  { day: 'Monday – Friday', hours: '7:00 AM – 7:00 PM' },
                  { day: 'Saturday', hours: '7:00 AM – 7:00 PM' },
                  { day: 'Sunday', hours: '9:00 AM – 4:00 PM' },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex justify-between items-center py-2 border-b border-[#1e3260]/30 last:border-0">
                    <span className="text-[#94a3b8] text-sm">{day}</span>
                    <span className="text-white text-sm font-semibold">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-bold text-lg mb-3">Not in Our Area?</h3>
                <p className="text-[#7a8fb5] text-sm mb-4">
                  We're always expanding. Drop us a call — we may still be able to serve you or
                  recommend a trusted partner nearby.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/booking"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#e84c1a] text-white font-bold text-sm hover:bg-[#ff6b35] transition-colors"
                >
                  Book Now
                  <ArrowRight size={14} />
                </Link>
                <a
                  href="tel:+16025551234"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#1e3260] text-[#94a3b8] font-semibold text-sm hover:text-white hover:border-[#e84c1a]/40 transition-colors"
                >
                  <Phone size={14} />
                  Call to Check Coverage
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
