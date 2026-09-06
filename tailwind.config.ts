import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f6f6",
          100: "#dcebea",
          200: "#bbd8d6",
          300: "#8fbdba",
          400: "#5f9c99",
          500: "#417f7d",
          600: "#316665",
          700: "#295352",
          800: "#244443",
          900: "#213a39",
          950: "#0f2120",
        },
        sand: {
          50: "#faf9f7",
          100: "#f3f1ec",
          200: "#e7e2d8",
          300: "#d6cdbb",
          400: "#c0b195",
          500: "#a99976",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 6px -1px rgb(0 0 0 / 0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
