module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './stories/**/*.{js,jsx,ts,tsx,mdx}',
    './.storybook/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: { extend: {} },
  plugins: [],
  corePlugins: {
    preflight: false, // disables Tailwind's global reset
  },
};