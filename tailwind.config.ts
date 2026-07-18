import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        card: "var(--color-card)",
        accent: "var(--color-accent)",
        "accent-dark": "var(--color-accent-dark)",
        ink: "var(--color-ink)",
        "ink-soft": "var(--color-ink-soft)",
        "ink-muted": "var(--color-ink-muted)",
        border: "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        // legacy tokens
        primary: "var(--color-accent)",
        "text-primary": "var(--color-ink)",
        "text-secondary": "var(--color-ink-soft)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "-apple-system", "sans-serif"],
        sans: ["var(--font-inter)", "-apple-system", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      maxWidth: {
        wide: "1440px",
        narrow: "1080px",
      },
    },
  },
  plugins: [],
};

export default config;
