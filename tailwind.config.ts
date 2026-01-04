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
        neonPink: "#ff4ecd",
        neonPurple: "#b026ff",
        neonBlue: "#00f0ff",
        darkBg: "#050008",
      },
      boxShadow: {
        neon: "0 0 20px rgba(255,78,205,0.6)",
        neonStrong: "0 0 40px rgba(176,38,255,0.8)",
      },
    },
  },
  plugins: [],
};

export default config;
