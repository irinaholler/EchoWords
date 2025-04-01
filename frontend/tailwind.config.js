/** @type {import('tailwindcss').Config} */

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Ensure Tailwind scans your files
    darkMode: "class", // Enable dark mode with class-based switching
    theme: {
        extend: {
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
            },
            animation: {
                'fade-in': 'fadeIn 1.5s ease-in-out',
            },
        },
    },
    plugins: [],
};

