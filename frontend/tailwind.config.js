/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ['Quicksand', 'sans-serif'],
      body: ['Quicksand', 'sans-serif'],
    },
    extend: {
      colors: {
        'primary' : '#fffd01',
        'secondary' : '#282828',
        'muted' : '#e8eaec'
      },
      backgroundColor: {
        'primary' : '#fffd01',
        'secondary' : '#282828',
        'alternate' : '#373737',
        'muted' : '#e8eaec'

      },
      borderWidth: {
        1: '1px',
      },
      borderColor: {
        'primary' : '#fffd01',
        'secondary' : '#282828',
        'alternate' : '#373737',
        'muted' : '#e8eaec'
      },
    },
  },
}
