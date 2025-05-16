import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      primary: ["Inter", "sans-serif"],
    },
  },
} satisfies Config;
