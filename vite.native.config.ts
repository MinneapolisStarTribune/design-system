import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.native.tsx', '.native.ts', '.tsx', '.ts', '.jsx', '.js'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    dts({
      include: [
        path.resolve(__dirname, 'src/index.native.ts'),
        path.resolve(__dirname, 'src/components/index.native.ts'),
      ],
      exclude: [
        'src/**/*.test.tsx',
        'src/**/*.test.ts',
        'src/**/*.stories.tsx',
        'src/**/*.stories.ts',
        'src/test-utils/**/*',
        'src/index.web.ts',
        'src/components/index.web.ts',
        'vite.*.config.ts',
        '**/vite.config.ts',
      ],
      outDir: 'dist/mobile',
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
        // Only copy the main entry file and rename it to index.native.d.ts
        // Other files will be copied as-is to maintain import paths
        if (
          filePath.endsWith('index.native.d.ts') ||
          (filePath.includes('index.native') && filePath.endsWith('.d.ts'))
        ) {
          // Ensure it's named index.native.d.ts in dist/mobile
          if (filePath.includes('index.native.d.ts')) {
            return {
              filePath: path.resolve(__dirname, 'dist', 'mobile', 'index.native.d.ts'),
              content,
            };
          }
        }
        // For the main index file, rename it
        if (filePath.endsWith('index.d.ts') && filePath.includes('index.native')) {
          return {
            filePath: path.resolve(__dirname, 'dist', 'mobile', 'index.native.d.ts'),
            content,
          };
        }
        return { filePath, content };
      },
    }),
  ],
  build: {
    emptyOutDir: false,
    outDir: 'dist/mobile',
    lib: {
      entry: 'src/index.native.ts',
      formats: ['es'],
      name: 'DesignSystemNative',
      fileName: () => 'design-system.es.js',
    },
    rollupOptions: {
      external: ['react', 'react-native', 'react-native-svg'],
      output: {
        globals: {
          react: 'React',
          'react-native': 'ReactNative',
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
