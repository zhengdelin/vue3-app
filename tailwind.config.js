import colors from "tailwindcss/colors";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  safelist: [
    // {
    //   pattern: /rounded-\d+/,
    // },
  ],
  theme: {
    colors: {
      ...colors,
      "x-black": "#000000",
    },
    borderRadius: {
      0: "0",
      1: "0.25rem",
      2: "0.5rem",
      3: "0.75rem",
      4: "1rem",
      5: "1.25rem",
      6: "1.5rem",
      7: "1.75rem",
      8: "2rem",
      9: "2.25rem",
      10: "2.5rem",
      11: "2.75rem",
      12: "3rem",
      circle: "50%",
      full: "9999px",
    },
    extend: {
      fontSize: {
        h1: ["56px", { lineHeight: "84px", fontWeight: 600 }],
        h2: ["48px", { lineHeight: "72px", fontWeight: 600 }],
        h3: ["36px", { lineHeight: "54px", fontWeight: 600 }],
        h4: ["28px", { lineHeight: "42px", fontWeight: 600 }],
        h5: ["20px", { lineHeight: "30px", fontWeight: 600 }],
        h6: ["18px", { lineHeight: "27px", fontWeight: 600 }],
        p1: ["15px", { lineHeight: "22px", fontWeight: 500 }],
        p2: ["14px", { lineHeight: "21px", fontWeight: 500 }],
        p3: ["12px", { lineHeight: "18px", fontWeight: 500 }],
      },
      fontFamily: {
        poppins: '"Poppins"',
      },
      spacing: {
        15: "3.75rem",
      },
      borderColor: {
        v: "rgba(var(--v-border-color), <alpha-value>)",
      },
    },
  },
  plugins: [],
};
