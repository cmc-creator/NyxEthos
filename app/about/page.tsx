import { Metadata } from 'next';
import { Wrench, Shield, Clock, Star, Award, Heart } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'About Us | Auto-Docs Mobile Mechanic',
  description: 'Meet the team behind Auto-Docs — Arizona\'s premier mobile mechanic service. ASE-certified technicians coming to you.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen hex-pattern">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e84c1a]/10 border border-[#e84c1a]/30 text-[#e84c1a] text-sm font-bold mb-6">
            <Wrench size={14} />
            The Auto-Docs Story
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
            Putting the Shop
            <br />
            <span className="gradient-text">In Your Driveway</span>
          </h1>
          <p className="text-[#94a3b8] text-lg leading-relaxed">
            Auto-Docs was born out of a simple frustration: Arizona's heat is brutal, waiting rooms are miserable, and towing your car across town for a basic repair shouldn't cost a small fortune. We decided to flip the model — you shouldn't have to go to the shop. The shop comes to you.
          </p>
        </div>
      </section>

      {/* Mechanic + Story */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="glass-card rounded-3xl p-8 sm:p-12 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            {/* Photo placeholder — replace with actual mechanic photo */}
            <div className="w-full aspect-square max-w-sm mx-auto rounded-2xl bg-gradient-to-br from-[#1e3a6e] via-[#162347] to-[#080f24] flex flex-col items-center justify-center border border-[#1e3260]">
              <Wrench size={64} className="text-[#e84c1a] mb-3 opacity-60" />
              <span className="text-[#7a8fb5] text-sm">Mechanic Photo</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-[#e84c1a]" />
              <span className="text-[#e84c1a] text-sm font-bold uppercase tracking-wider">Lead Technician</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-4">
              Professional. Certified. On Your Schedule.
            </h2>
            <p className="text-[#94a3b8] leading-relaxed mb-4">
              With over 10 years of hands-on automotive experience and ASE certifications, the Auto-Docs team has seen it all — from routine oil changes on a scorching Phoenix afternoon to full brake overhauls parked in an apartment complex lot.
            </p>
            <p className="text-[#94a3b8] leading-relaxed mb-6">
              We service all makes and models across the greater Phoenix metro area. Every repair comes with a satisfaction guarantee and transparent, upfront pricing — no hidden fees, no upsells, no surprises.
            </p>
            <div className="flex flex-wrap gap-3">
              {['ASE Certified', '10+ Years Exp.', 'All Makes & Models', 'Satisfaction Guaranteed'].map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1.5 rounded-full bg-[#1e3260]/60 border border-[#1e3260] text-[#94a3b8] text-xs font-semibold"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-black text-white text-center mb-8">
          What We Stand For
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'Transparency', desc: 'Upfront pricing on every job. You know the cost before we turn a wrench.', color: '#e84c1a' },
            { icon: Clock, title: 'Your Time Matters', desc: 'We work around your schedule — early mornings, evenings, weekends.', color: '#3b82f6' },
            { icon: Star, title: 'Quality Work', desc: 'OEM or better parts on every repair. We stand behind everything we do.', color: '#eab308' },
            { icon: Award, title: 'Certified Expertise', desc: 'ASE-certified technicians who stay current with the latest automotive technology.', color: '#10b981' },
            { icon: Heart, title: 'Community First', desc: 'We\'re your neighbors. We live and work in the same Arizona communities we serve.', color: '#a855f7' },
            { icon: Wrench, title: 'Fully Equipped', desc: 'Professional-grade tools and diagnostic equipment brought right to your location.', color: '#f97316' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="glass-card rounded-2xl p-6">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}20` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <h3 className="text-white font-bold mb-2">{title}</h3>
              <p className="text-[#7a8fb5] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="rounded-2xl bg-[#e84c1a] p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '200+', label: 'Happy Customers' },
            { value: '15+', label: 'Services Offered' },
            { value: '20+', label: 'Arizona Cities' },
            { value: '10+', label: 'Years Experience' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-black text-white">{value}</div>
              <div className="text-white/70 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
