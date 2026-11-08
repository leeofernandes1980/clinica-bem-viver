import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#1A6B5A",
          hover: "#145546",
        },
        secondary: "#F0FDF4",
      },
    },
  },
  plugins: [],
};

export default config;
