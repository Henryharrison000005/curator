export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        "ink-2": "rgb(var(--ink-2-rgb) / <alpha-value>)",
        "ink-3": "rgb(var(--ink-3-rgb) / <alpha-value>)",
        "ink-4": "rgb(var(--ink-4-rgb) / <alpha-value>)",
        pine: "rgb(var(--ink-2-rgb) / <alpha-value>)",
        "pine-2": "rgb(var(--ink-3-rgb) / <alpha-value>)",
        "pine-3": "rgb(var(--ink-4-rgb) / <alpha-value>)",
        moss: "rgb(var(--moss-rgb) / <alpha-value>)",
        "moss-2": "rgb(var(--moss-2-rgb) / <alpha-value>)",
        leaf: "rgb(var(--leaf-rgb) / <alpha-value>)",
        ivory: "rgb(var(--ivory-rgb) / <alpha-value>)",
        bone: "rgb(var(--bone-rgb) / <alpha-value>)",
        paper: "rgb(var(--paper-rgb) / <alpha-value>)",
        signal: "rgb(var(--signal-rgb) / <alpha-value>)",
        "signal-2": "rgb(var(--signal-2-rgb) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
