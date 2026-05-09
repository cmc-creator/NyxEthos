"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useWaitlist } from "@/context/WaitlistContext";

export default function CTA() {
  const { open } = useWaitlist();
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div
          className="relative rounded-3xl shine-border border overflow-hidden p-12 md:p-16"
          style={{
            background:
              "linear-gradient(145deg, rgba(22,12,52,0.99) 0%, rgba(10,8,28,0.99) 100%)",
            borderColor: "rgba(124,58,237,0.40)",
            boxShadow:
              "0 0 160px rgba(124,58,237,0.18), 0 0 80px rgba(30,95,232,0.12), 0 30px 80px rgba(0,0,0,0.60)",
          }}
        >
          {/* Amethyst glow — upper center */}
          <div
            className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
            style={{ background: "rgba(124,58,237,0.32)", filter: "blur(100px)" }}
          />
          {/* Sapphire glow — lower left */}
          <div
            className="absolute bottom-[-40px] left-[10%] w-[300px] h-[200px] rounded-full pointer-events-none"
            style={{ background: "rgba(30,95,232,0.20)", filter: "blur(80px)" }}
          />
          {/* Gold glint — lower right */}
          <div
            className="absolute bottom-[-20px] right-[10%] w-[200px] h-[150px] rounded-full pointer-events-none"
            style={{ background: "rgba(201,164,74,0.14)", filter: "blur(70px)" }}
          />

          <div className="relative z-10">
            {/* Small top badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
              style={{
                background: "rgba(6,7,15,0.70)",
                border: "1px solid rgba(201,164,74,0.35)",
                color: "#f0d07a",
              }}
            >
              <Sparkles size={10} />
              NyxEthos — Premium HR
            </div>

            <h2 className="font-heading text-4xl md:text-5xl font-bold text-nyx-white tracking-[-0.03em] mb-4">
              HR That Finally{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #4d8fff 0%, #a855f7 50%, #f0d07a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Fits Your Team
              </span>
            </h2>
            <p className="text-nyx-text text-lg max-w-xl mx-auto mb-10 font-light leading-relaxed">
              Join forward-thinking teams who chose to stop paying for features
              they never use. Get started with NyxEthos in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={() => open()}
                className="group relative flex items-center gap-2.5 px-8 py-4 rounded-full text-white font-semibold text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #1e5fe8 0%, #7c3aed 60%, #a855f7 100%)",
                  boxShadow:
                    "0 4px 32px rgba(124,58,237,0.55), 0 0 60px rgba(30,95,232,0.18), inset 0 1px 0 rgba(255,255,255,0.18)",
                }}
              >
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, #4d8fff 0%, #a855f7 50%, #1e5fe8 100%)",
                  }}
                  aria-hidden="true"
                />
                <span className="relative z-10 flex items-center gap-2.5">
                  Start Your Free Trial
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </span>
              </button>

              <a
                href="mailto:info@nyxethos.com"
                className="px-8 py-4 rounded-full glass-card border border-nyx-border hover:border-nyx-amethyst/40 text-nyx-text hover:text-nyx-white font-semibold text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5"
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

