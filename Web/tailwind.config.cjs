/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            'snow': '#F5FEFD',
            'gunmetal': '#2C3539', // this is the trashiest name I've ever seen for a colour
        },
      
        // that is animation class
        animation: {
            fade_in_txt: 'fadeInTxt 2s ease-in-out',
            fade_in_bg: 'fadeInBg 2s ease-in-out',
            fade_in: 'fadeIn 2s ease-in-out',
            fade_out: 'fadeOut 2s ease-in-out',
        },
        // that is actual animation
        keyframes: theme => ({
            // I have no clue how to incorporate this with light/dark mode
            fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' },
            },
            fadeOut: {
                '0%': { opacity: '1' },
                '100%': { opacity: '0' },
            },
            fadeInTxt: {
            '0%': { color: theme('colors.transparent') },
            '100%': { color: theme('colors.black') },
            },
            fadeInBg: {
                '0%': { backgroundColor: theme('colors.transparent') },
                '100%': { backgroundColor: theme('colors.gunmetal') },
            }
        }),
    },
  },
  plugins: [
    // require('@tailwindcss/typography'),
  ],
}
