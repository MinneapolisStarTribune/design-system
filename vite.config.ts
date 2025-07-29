import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  css: {
    postcss: './postcss.config.js',
  },
  plugins: [react()],
  build: {
    lib: {
      entry: ('src/index.ts'),
      name: 'DesignSystem',
      fileName: (format) => `design-system.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});