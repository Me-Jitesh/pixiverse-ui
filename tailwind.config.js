export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        keyframes: {
          gradient: {
            "0%, 100%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
          },
        },
        animation: {
          gradient: "gradient 6s ease infinite",
        },
      },
    },
    plugins: [],
  };
  