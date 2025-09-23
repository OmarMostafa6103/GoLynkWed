/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        // Brand colors
        brand: {
          primary: "rgb(254, 86, 59)", // Vibrant orange for primary elements
          text: "rgb(24, 24, 24)", // Dark gray for text
          background: "rgb(255, 255, 255)", // White for backgrounds
        },
        // Colors for senders
        sender: {
          bg: "#FEE2E2", // Light red background for sender tables
          text: "#B91C1C", // Dark red text
          hover: "#FECACA", // Hover background
        },
        // Colors for travelers
        traveler: {
          bg: "#E0F2FE", // Light blue background for traveler tables
          text: "rgb(254, 86, 59)", // Brand primary for text
          hover: "#BAE6FD", // Hover background
        },
        // Colors for buttons
        action: {
          verify: "#15803D", // Green for verify
          reject: "#B91C1C", // Red for reject
          block: "#4B5563", // Gray for block
        },
        // Additional colors from index.css
        accent: {
          DEFAULT: "#C586A5", // Focus color
          light: "#ffebf5", // Active state background
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
        slideIn: "slideIn 0.3s ease-out",
        bounce: "bounce 1s infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        medium:
          "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        strong:
          "0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      transitionDuration: {
        200: "200ms",
        300: "300ms",
        400: "400ms",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const newUtilities = {
        ".text-responsive-xs": {
          fontSize: "0.75rem",
          lineHeight: "1rem",
        },
        ".text-responsive-sm": {
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
        },
        ".text-responsive-base": {
          fontSize: "1rem",
          lineHeight: "1.5rem",
        },
        ".text-responsive-lg": {
          fontSize: "1.125rem",
          lineHeight: "1.75rem",
        },
        ".text-responsive-xl": {
          fontSize: "1.25rem",
          lineHeight: "1.75rem",
        },
        ".text-responsive-2xl": {
          fontSize: "1.5rem",
          lineHeight: "2rem",
        },
        ".container-responsive": {
          width: "100%",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: "1200px",
        },
        ".card-responsive": {
          backgroundColor: "white",
          borderRadius: "0.5rem",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          border: "1px solid #e5e7eb",
          padding: "1rem",
        },
        ".btn-responsive": {
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          fontSize: "0.875rem",
          fontWeight: "500",
          borderRadius: "0.5rem",
          transitionProperty: "all",
          transitionDuration: "200ms",
          outline: "none",
        },
        ".input-responsive": {
          width: "100%",
          paddingLeft: "0.75rem",
          paddingRight: "0.75rem",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          fontSize: "0.875rem",
          border: "1px solid #d1d5db",
          borderRadius: "0.5rem",
          outline: "none",
        },
        ".table-responsive": {
          width: "100%",
          overflowX: "auto",
        },
        ".mobile-spacing": {
          "--tw-space-y-reverse": "0",
          marginTop: "calc(1rem * calc(1 - var(--tw-space-y-reverse)))",
          marginBottom: "calc(1rem * var(--tw-space-y-reverse))",
        },
        ".mobile-padding": {
          padding: "1rem",
        },
        "@media (min-width: 640px)": {
          ".text-responsive-xs": {
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
          },
          ".text-responsive-sm": {
            fontSize: "1rem",
            lineHeight: "1.5rem",
          },
          ".text-responsive-base": {
            fontSize: "1.125rem",
            lineHeight: "1.75rem",
          },
          ".text-responsive-lg": {
            fontSize: "1.25rem",
            lineHeight: "1.75rem",
          },
          ".text-responsive-xl": {
            fontSize: "1.5rem",
            lineHeight: "2rem",
          },
          ".text-responsive-2xl": {
            fontSize: "1.875rem",
            lineHeight: "2.25rem",
          },
          ".container-responsive": {
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          },
          ".card-responsive": {
            padding: "1.5rem",
          },
          ".btn-responsive": {
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
            paddingTop: "0.75rem",
            paddingBottom: "0.75rem",
            fontSize: "1rem",
          },
          ".input-responsive": {
            paddingLeft: "1rem",
            paddingRight: "1rem",
            paddingTop: "0.75rem",
            paddingBottom: "0.75rem",
            fontSize: "1rem",
          },
        },
        "@media (min-width: 1024px)": {
          ".text-responsive-xs": {
            fontSize: "1rem",
            lineHeight: "1.5rem",
          },
          ".text-responsive-sm": {
            fontSize: "1.125rem",
            lineHeight: "1.75rem",
          },
          ".text-responsive-base": {
            fontSize: "1.25rem",
            lineHeight: "1.75rem",
          },
          ".text-responsive-lg": {
            fontSize: "1.5rem",
            lineHeight: "2rem",
          },
          ".text-responsive-xl": {
            fontSize: "1.875rem",
            lineHeight: "2.25rem",
          },
          ".text-responsive-2xl": {
            fontSize: "2.25rem",
            lineHeight: "2.5rem",
          },
          ".container-responsive": {
            paddingLeft: "2rem",
            paddingRight: "2rem",
          },
          ".card-responsive": {
            padding: "2rem",
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
