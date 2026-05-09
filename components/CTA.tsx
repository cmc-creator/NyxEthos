"use client";

import { ArrowRight } from "lucide-react";
import { useWaitlist } from "@/context/WaitlistContext";

export default function CTA() {
  const { open } = useWaitlist();
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative rounded-3xl glass-card shine-border border border-nyx-border overflow-hidden p-12 md:p-16">
          {/* Glow layers */}
          <div className="absolute inset-0 bg-hero-gradient opacity-50 pointer-events-none" />
          <div className="absolute inset-0 bg-hero-violet opacity-60 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-nyx-white tracking-[-0.03em] mb-4">
              HR That Finally{" "}
              <span className="text-gradient">Fits Your Team</span>
            </h2>
            <p className="text-nyx-text text-lg max-w-xl mx-auto mb-10 font-light leading-relaxed">
              Join forward-thinking teams who chose to stop paying for features
              they never use. Get started with NyxEthos in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={() => open()}
                className="group flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-nyx-blue to-nyx-blue-bright hover:from-nyx-blue-bright hover:to-nyx-blue rounded-full text-white font-semibold text-sm tracking-wide transition-all duration-300 shadow-btn-primary hover:shadow-btn-primary-hover hover:-translate-y-0.5"
              >
                Start Your Free Trial
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </button>
              <a
                href="mailto:info@nyxethos.com"
                className="px-8 py-4 rounded-full glass-card border border-nyx-border hover:border-nyx-border-bright text-nyx-text hover:text-nyx-white font-semibold text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5"
              >
                Talk to Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
