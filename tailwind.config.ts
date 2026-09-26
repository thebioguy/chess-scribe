module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f6ff',
          100: '#ebefff',
          200: '#d7defe',
          300: '#b3c2ff',
          400: '#7e96ff',
          500: '#4f6df7',
          600: '#3554df',
          700: '#2d46b6',
          800: '#273d92',
          900: '#243774'
        }
      },
      boxShadow: {
        panel: '0 25px 50px -12px rgba(20, 30, 70, 0.25)'
      }
    }
  },
  plugins: []
};
