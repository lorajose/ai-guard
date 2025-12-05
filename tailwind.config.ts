import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cyberBlue: "#04142b",
        neonGreen: "#39ff14",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
