/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    // Define a minimal color palette: two main colors (dark, white)
    // plus the extra semantic colors requested.
    colors: {
      // Core
      transparent: 'transparent',
      current: 'currentColor',
      dark: '#0f1724', // main dark color (you can change this hex)
      white: '#ffffff',

      // Semantic aliases
      primary: '#0f1724', // alias to dark
      background: '#ffffff', // alias to white

      // Extras
      green: '#10B981', // success
      blue: '#3B82F6', // info
      red: '#EF4444', // danger
      warning: '#F59E0B', // warning (yellow)
    },
  },
  plugins: [],
}