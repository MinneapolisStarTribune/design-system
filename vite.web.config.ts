import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import svgr from 'vite-plugin-svgr';
import dts from 'vite-plugin-dts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    svgr({
      svgrOptions: {
        icon: true,
      },
      include: '**/*.svg?react',
    }),
    dts({
      include: [
        path.resolve(__dirname, 'src/index.web.ts'),
        path.resolve(__dirname, 'src/components/index.web.ts'),
      ],
      exclude: [
        'src/**/*.test.tsx',
        'src/**/*.test.ts',
        'src/**/*.stories.tsx',
        'src/**/*.stories.ts',
        'src/test-utils/**/*',
        'src/index.native.ts',
        'src/components/index.native.ts',
        'vite.*.config.ts',
        '**/vite.config.ts',
      ],
      outDir: 'dist/web',
      entryRoot: path.resolve(__dirname, 'src'),
      insertTypesEntry: false,
      rollupTypes: false,
      copyDtsFiles: true,
      compilerOptions: {
        baseUrl: __dirname,
        paths: {
          '@/*': [path.resolve(__dirname, 'src/*')],
        },
      },
      beforeWriteFile: (filePath, content) => {
        const normalizedPath = filePath.replace(/\\/g, '/');

        // Keep the components barrel types at dist/web/components/index.web.d.ts
        if (normalizedPath.endsWith('components/index.web.d.ts')) {
          return { filePath, content };
        }

        // Ensure the main web entrypoint types are written to dist/web/index.web.d.ts
        if (normalizedPath.endsWith('index.web.d.ts')) {
          return {
            filePath: path.resolve(__dirname, 'dist', 'web', 'index.web.d.ts'),
            content,
          };
        }

        return { filePath, content };
      },
    }),
  ],
  build: {
    emptyOutDir: false,
    outDir: 'dist/web',
    lib: {
      entry: 'src/index.web.ts',
      formats: ['es'],
      name: 'DesignSystem',
      fileName: () => 'design-system.es.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'React',
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
