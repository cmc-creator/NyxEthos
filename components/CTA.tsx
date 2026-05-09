"use client";

import { ArrowRight } from "lucide-react";
import { useWaitlist } from "@/context/WaitlistContext";

export default function CTA() {
  const { open } = useWaitlist();
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative rounded-3xl border border-nyx-border bg-nyx-card overflow-hidden p-12 md:p-16">
          {/* Glow */}
          <div className="absolute inset-0 bg-hero-gradient opacity-60 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-nyx-white tracking-tight mb-4">
              HR That Finally{" "}
              <span className="text-gradient">Fits Your Team</span>
            </h2>
            <p className="text-nyx-text text-lg max-w-xl mx-auto mb-10">
              Join forward-thinking teams who chose to stop paying for features
              they never use. Get started with NyxEthos in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={() => open()}
                className="group flex items-center gap-2 px-7 py-3.5 bg-nyx-blue hover:bg-nyx-blue-bright rounded-xl text-white font-semibold text-base transition-all duration-200 shadow-blue-glow"
              >
                Start Your Free Trial
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <a
                href="mailto:info@nyxethos.com"
                className="px-7 py-3.5 border border-nyx-border bg-transparent hover:border-nyx-blue rounded-xl text-nyx-text hover:text-nyx-white font-semibold text-base transition-all duration-200"
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
