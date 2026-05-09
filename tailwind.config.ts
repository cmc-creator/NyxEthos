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
          bg: "#040d1a",
          surface: "#071428",
          card: "#0a1d3a",
          border: "#0d2a52",
          blue: "#1d6fe8",
          "blue-bright": "#3b8bff",
          "blue-glow": "#2563eb",
          muted: "#4a6490",
          text: "#c8d8f0",
          white: "#f0f6ff",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(29,111,232,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(29,111,232,0.04) 1px, transparent 1px)",
        "hero-gradient":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(29,111,232,0.18) 0%, transparent 70%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(29,111,232,0.08) 0%, rgba(4,13,26,0) 100%)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      boxShadow: {
        "blue-glow": "0 0 40px rgba(29,111,232,0.20)",
        "card-hover": "0 0 0 1px rgba(59,139,255,0.4), 0 8px 32px rgba(29,111,232,0.12)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
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
      },
    },
  },
  plugins: [],
};

export default config;
