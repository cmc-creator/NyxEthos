import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nyx: {
          // ── Base dark palette (violet-cast near-black) ──
          bg: "#06070f",
          surface: "#0a0b1a",
          card: "#0e0f24",
          border: "#1c1d3e",
          "border-bright": "#2e315f",
          // ── Sapphire (primary CTA) ──
          blue: "#1e5fe8",
          "blue-bright": "#4d8fff",
          "blue-glow": "#1752cc",
          // ── Jewel accent palette ──
          violet: "#7c3aed",
          "violet-bright": "#a855f7",
          amethyst: "#6d28d9",
          "amethyst-bright": "#8b5cf6",
          emerald: "#047857",
          "emerald-bright": "#10b981",
          ruby: "#be123c",
          "ruby-bright": "#f43f5e",
          teal: "#0f766e",
          "teal-bright": "#2dd4bf",
          // ── Gold ──
          gold: "#c9a44a",
          "gold-bright": "#f0d07a",
          "gold-dim": "#7a5f1f",
          // ── Text ──
          muted: "#484b78",
          text: "#b0b5e0",
          white: "#eef0ff",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Sora", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(30,95,232,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(30,95,232,0.07) 1px, transparent 1px)",
        "hero-gradient":
          "radial-gradient(ellipse 90% 70% at 50% 20%, rgba(30,95,232,0.65) 0%, rgba(30,95,232,0.22) 40%, transparent 70%)",
        "hero-violet":
          "radial-gradient(ellipse 75% 65% at 90% 5%, rgba(124,58,237,0.55) 0%, rgba(109,40,217,0.18) 50%, transparent 70%)",
        "hero-emerald":
          "radial-gradient(ellipse 50% 40% at 5% 80%, rgba(4,120,87,0.28) 0%, transparent 60%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(30,95,232,0.14) 0%, rgba(6,7,15,0) 100%)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
        "shimmer-gradient":
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)",
        "amethyst-gradient":
          "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(109,40,217,0.45) 0%, transparent 70%)",
        "jewel-border":
          "linear-gradient(135deg, #4d8fff 0%, #a855f7 40%, #c9a44a 80%, #10b981 100%)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      boxShadow: {
        "blue-glow": "0 0 40px rgba(30,95,232,0.35)",
        "blue-glow-sm": "0 0 20px rgba(30,95,232,0.22)",
        "amethyst-glow": "0 0 40px rgba(124,58,237,0.40)",
        "amethyst-glow-sm": "0 0 20px rgba(124,58,237,0.25)",
        "emerald-glow": "0 0 30px rgba(4,120,87,0.35)",
        "ruby-glow": "0 0 30px rgba(190,18,60,0.35)",
        "gold-glow": "0 0 40px rgba(201,164,74,0.45)",
        "gold-glow-sm": "0 0 20px rgba(201,164,74,0.30)",
        "card-hover":
          "0 0 0 1px rgba(77,143,255,0.55), 0 12px 40px rgba(30,95,232,0.22), 0 0 80px rgba(124,58,237,0.10)",
        "card-hover-amethyst":
          "0 0 0 1px rgba(168,85,247,0.55), 0 12px 40px rgba(124,58,237,0.22)",
        "pricing-glow":
          "0 0 0 1px rgba(77,143,255,0.60), 0 0 80px rgba(30,95,232,0.28), 0 20px 60px rgba(124,58,237,0.18)",
        "btn-primary":
          "0 4px 24px rgba(30,95,232,0.60), inset 0 1px 0 rgba(255,255,255,0.18)",
        "btn-primary-hover":
          "0 6px 40px rgba(77,143,255,0.70), inset 0 1px 0 rgba(255,255,255,0.28)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 3s linear infinite",
        float: "float 7s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        "spin-slow": "spin 12s linear infinite",
        glow: "glow 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
