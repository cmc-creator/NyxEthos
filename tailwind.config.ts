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
          bg: "#060e1e",
          surface: "#0a1830",
          card: "#102040",
          border: "#1a3a6a",
          "border-bright": "#2a5499",
          blue: "#2570f5",
          "blue-bright": "#4d8fff",
          "blue-glow": "#1a5cd4",
          violet: "#6366f1",
          gold: "#c9a44a",
          "gold-dim": "#8a6b2f",
          muted: "#3d5a7a",
          text: "#b8cce8",
          white: "#eef5ff",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Sora", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(37,112,245,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,112,245,0.06) 1px, transparent 1px)",
        "hero-gradient":
          "radial-gradient(ellipse 90% 70% at 50% 20%, rgba(37,112,245,0.60) 0%, rgba(37,112,245,0.20) 40%, transparent 70%)",
        "hero-violet":
          "radial-gradient(ellipse 70% 60% at 90% 10%, rgba(99,102,241,0.45) 0%, rgba(99,102,241,0.10) 50%, transparent 70%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(37,112,245,0.14) 0%, rgba(3,9,15,0) 100%)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
        "shimmer-gradient":
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      boxShadow: {
        "blue-glow": "0 0 40px rgba(37,112,245,0.30)",
        "blue-glow-sm": "0 0 20px rgba(37,112,245,0.20)",
        "card-hover": "0 0 0 1px rgba(77,143,255,0.55), 0 12px 40px rgba(37,112,245,0.20)",
        "pricing-glow": "0 0 0 1px rgba(37,112,245,0.6), 0 0 80px rgba(37,112,245,0.22), 0 20px 60px rgba(37,112,245,0.12)",
        "btn-primary": "0 4px 24px rgba(37,112,245,0.55), inset 0 1px 0 rgba(255,255,255,0.18)",
        "btn-primary-hover": "0 6px 36px rgba(77,143,255,0.65), inset 0 1px 0 rgba(255,255,255,0.25)",
        "gold-glow": "0 0 36px rgba(201,164,74,0.35)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 10s linear infinite",
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
      },
    },
  },
  plugins: [],
};

export default config;
