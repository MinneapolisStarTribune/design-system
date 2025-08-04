import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { execSync } from 'child_process';

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    {
      name: 'postcss-build',
      closeBundle() {
        execSync(
          'cross-env NODE_ENV=production tailwindcss -i ./src/tailwind.css -o ./dist/design-system.css --minify',
          { stdio: 'inherit' }
        );
      }
    }
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      name: 'DesignSystem',
      fileName: (format) => `design-system.${format}.js`,
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
    target: 'esnext',
    sourcemap: true,
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
});
