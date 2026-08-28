export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2-rgb) / <alpha-value>)",
        "surface-3": "rgb(var(--surface-3-rgb) / <alpha-value>)",
        "surface-4": "rgb(var(--bg-rgb) / <alpha-value>)",
        ink: "rgb(var(--text-rgb) / <alpha-value>)",
        "ink-2": "rgb(var(--text-2-rgb) / <alpha-value>)",
        "ink-3": "rgb(var(--text-3-rgb) / <alpha-value>)",
        pine: "rgb(var(--surface-rgb) / <alpha-value>)",
        "pine-2": "rgb(var(--surface-2-rgb) / <alpha-value>)",
        "pine-3": "rgb(var(--bg-rgb) / <alpha-value>)",
        moss: "rgb(var(--accent-rgb) / <alpha-value>)",
        "moss-2": "rgb(var(--accent-2-rgb) / <alpha-value>)",
        leaf: "rgb(var(--accent-3-rgb) / <alpha-value>)",
        ivory: "rgb(var(--bg-rgb) / <alpha-value>)",
        bone: "rgb(var(--border-rgb) / <alpha-value>)",
        paper: "rgb(var(--surface-rgb) / <alpha-value>)",
        signal: "rgb(var(--accent-rgb) / <alpha-value>)",
        "signal-2": "rgb(var(--danger-rgb) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
