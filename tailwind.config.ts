import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0F172A",
          foreground: "#F8FAFC",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        secondary: {
          DEFAULT: "#1E40AF",
          foreground: "#F8FAFC",
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        accent: {
          DEFAULT: "#22C55E",
          foreground: "#020617",
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#F8FAFC",
        },
        muted: {
          DEFAULT: "#1e293b",
          foreground: "#94a3b8",
        },
        popover: {
          DEFAULT: "#0f172a",
          foreground: "#F8FAFC",
        },
        card: {
          DEFAULT: "#0f172a",
          foreground: "#F8FAFC",
        },
        chart: {
          up: "#22C55E",
          down: "#ef4444",
          neutral: "#3b82f6",
          volume: "#6366f1",
          grid: "#1e293b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "slide-up": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)",
        "card-gradient": "linear-gradient(145deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.8) 100%)",
        "accent-gradient": "linear-gradient(135deg, #22C55E 0%, #16a34a 100%)",
        "blue-gradient": "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
