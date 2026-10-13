import react from '@vitejs/plugin-react';
import path from 'path';
import preserveDirectives from 'rollup-preserve-directives';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Everything the adapters sit on top of is a peer — never bundle it. */
const EXTERNAL = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  /^@tanstack\//,
  /^@minneapolisstartribune\/design-system(\/.*)?$/,
];

export default defineConfig({
  plugins: [
    react(),
    preserveDirectives(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
      outDir: 'dist',
      entryRoot: path.resolve(__dirname, 'src'),
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: EXTERNAL,
    },
    target: 'esnext',
    sourcemap: true,
  },
});
