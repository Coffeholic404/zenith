import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        subtext: "hsla(var(--subtext))",
        sidebaractive: "hsla(var(--sidebar-icon-clr))",
        mainBg: "hsla(var(--main-bg))",
        searchBg: "hsla(var(--search-bg))",
        userWelcomClr: "hsla(var(--user-welcom-clr))",
        userEmailClr: "hsla(var(--user-email-clr))",
        placesClr: "hsla(var(--places-clr))",
        couresClr: "hsla(var(--coures-clr))",
        studentClr: "hsla(var(--student-clr))",
        employeeClr: "hsla(var(--employee-clr))",
        updatesClr: "hsla(var(--updates-clr))",
        updatesBtnClr: "hsla(var(--updates-btn-clr))",
        btnTxtClr: "hsla(var(--btn-txt-clr))",
        accidentBtnClr: "hsla(var(--accident-btn-clr))",
        accidentTxtClr: "hsla(var(--accident-txt-clr))",
        placeholderClr: "hsla(var(--placeholder-clr))",
        tableHeader: "hsla(var(--table-header))",
        tableRow: "hsla(var(--table-row))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        vazirmatn: ['Vazirmatn', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

