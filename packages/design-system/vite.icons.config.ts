import * as path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Builds the icons barrel with preserveModules so each icon is a separate chunk.
 * Consumers that import only the icons they need get tree-shaking.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: { icon: true },
      include: '**/*.svg?react',
    }),
  ],
  build: {
    outDir: 'dist/web/icons',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/icons/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: 'src/icons',
        entryFileNames: '[name].js',
      },
    },
    target: 'esnext',
    sourcemap: true,
  },
});
