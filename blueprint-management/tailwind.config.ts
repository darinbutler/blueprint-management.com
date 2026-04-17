import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
    "./src/pages/**/*.{ts,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Blueprint brand palette — anchored around the blue from the existing logo
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#b4ccff",
          300: "#7fa8ff",
          400: "#4b80f6",
          500: "#1f56e0",
          600: "#143db8", // primary brand blue
          700: "#0f2f8f",
          800: "#0a2066",
          900: "#06153f"
        },
        ink: {
          DEFAULT: "#0a0a0f",
          soft: "#1a1a24",
          muted: "#6b7280"
        },
        canvas: {
          DEFAULT: "#fafafa",
          paper: "#ffffff",
          dark: "#0a0a0f"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
      },
      letterSpacing: {
        tightest: "-0.04em",
        wider2: "0.2em"
      },
      maxWidth: {
        "screen-2xl": "1440px"
      },
      boxShadow: {
        editorial: "0 30px 80px -20px rgba(10,32,102,0.25)"
      },
      backgroundImage: {
        "grain": "url('/grain.png')",
        "radial-brand":
          "radial-gradient(1200px 600px at 80% -10%, rgba(20,61,184,0.35), transparent 60%), radial-gradient(800px 400px at 10% 110%, rgba(20,61,184,0.25), transparent 60%)"
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "ticker": "ticker 40s linear infinite"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
