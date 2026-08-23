/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "background": "var(--bg-primary, #131313)",
        "on-background": "var(--text-primary, #f5f2ed)",
        "surface": "var(--bg-surface, #131313)",
        "surface-container": "var(--bg-surface-container, #222222)",
        "surface-container-low": "var(--bg-surface-low, #1c1b1b)",
        "surface-container-high": "var(--bg-surface-high, #2d2d2d)",
        "surface-container-highest": "var(--bg-surface-highest, #383838)",
        "surface-container-lowest": "var(--bg-surface-lowest, #0e0e0e)",
        "surface-bright": "#393939",
        "surface-dim": "var(--bg-surface, #131313)",
        "on-surface": "var(--text-primary, #f5f2ed)",
        "on-surface-variant": "var(--text-secondary, #c7bba8)",
        "on-dark": "var(--text-on-dark, #ffffff)",
        "inverse": "var(--text-inverse, #ffffff)",
        "icon-accent": "var(--icon-accent, #ffbf00)",
        "primary": "var(--color-primary, #ffe2ab)",
        "primary-container": "var(--color-primary-container, #ffbf00)",
        "on-primary": "var(--text-on-primary, #ffffff)",
        "on-primary-container": "var(--text-on-primary-container, #ffffff)",
        "primary-fixed": "var(--color-primary-fixed, #ffdfa0)",
        "primary-fixed-dim": "var(--color-primary-fixed-dim, #fbbc00)",
        "secondary": "var(--color-secondary, #c8c8b0)",
        "secondary-container": "var(--color-secondary-container, #494a38)",
        "on-secondary": "#303221",
        "outline": "var(--border-subtle, rgba(255,255,255,0.1))",
        "outline-variant": "var(--border-card, rgba(255,255,255,0.08))",
        "error": "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
        "tertiary": "#e8e5e4",
        "tertiary-container": "#cbc9c8"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px",
        "2xl": "1rem"
      },
      spacing: {
        "stack-sm": "12px",
        "stack-md": "24px",
        "gutter": "16px",
        "stack-lg": "48px",
        "container-padding": "24px",
        "base": "8px",
        "safe": "env(safe-area-inset-bottom)"
      },
      fontFamily: {
        "label-sm": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-md": ["Montserrat", "sans-serif"],
        "headline-xl": ["Montserrat", "sans-serif"],
        "headline-lg": ["Montserrat", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Montserrat", "sans-serif"]
      },
      fontSize: {
        "label-sm": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
        "headline-xl": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "label-md": ["14px", { "lineHeight": "20px", "letterSpacing": "0.01em", "fontWeight": "500" }],
        "headline-lg-mobile": ["28px", { "lineHeight": "34px", "fontWeight": "600" }]
      }
    },
  },
  plugins: [],
};
