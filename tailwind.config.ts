import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#05060f",
          800: "#0a0b18",
          700: "#101227",
          600: "#171a33",
          500: "#1f2340",
        },
        neon: {
          pink: "#ff3d9a",
          violet: "#8b5cf6",
          cyan: "#22d3ee",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(255,61,154,0.55)",
        "glow-violet": "0 0 50px -12px rgba(139,92,246,0.6)",
      },
      backgroundImage: {
        "riviera-grad":
          "linear-gradient(135deg, rgba(255,61,154,0.9) 0%, rgba(139,92,246,0.9) 50%, rgba(34,211,238,0.9) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
