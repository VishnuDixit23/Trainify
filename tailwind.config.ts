import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#fdf8ef",
          100: "#f5e6c4",
          200: "#e8cc8a",
          300: "#d4ad55",
          400: "#c49628",
          500: "#b5821e",
          600: "#8c5f0f",
          700: "#6b4a0e",
          800: "#4a340f",
          900: "#2d1f0a",
          950: "#170f05",
        },
        surface: {
          50: "#f0f0f0",
          100: "#e0e0e0",
          200: "#c8c8c8",
          300: "#9b9b9b",
          400: "#646464",
          500: "#454545",
          600: "#353535",
          700: "#232323",
          800: "#161616",
          900: "#0c0c0c",
          950: "#050505",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in-down": "fadeInDown 0.6s ease-out forwards",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "floatDelayed 8s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        floatDelayed: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 15px -5px rgba(181, 130, 30, 0.15)" },
          "50%": { boxShadow: "0 0 30px -5px rgba(181, 130, 30, 0.3)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
