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
      '@mobile/themes': path.resolve(__dirname, 'dist/mobile/themes'),
      '@mobile/typography': path.resolve(__dirname, 'dist/mobile/typography'),
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
        path.resolve(__dirname, 'src/components/Icon/Icon.native.tsx'),
        path.resolve(__dirname, 'src/icons/index.native.ts'),
        path.resolve(__dirname, 'src/providers/DesignSystemProvider.native.tsx'),
        path.resolve(__dirname, 'src/providers/theme-helpers.ts'),
        path.resolve(__dirname, 'src/providers/DesignSystemContext.ts'),
        path.resolve(__dirname, 'src/providers/BrandValidationErrorBoundary.tsx'),
        path.resolve(__dirname, 'src/hooks/useNativeStyles.ts'),
        path.resolve(__dirname, 'src/types'),
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
        const normalized = filePath.split(path.sep).join('/');
        // Do not map both `src/index.native` and `components/index.native` to the same output
        // file — that dropped DesignSystemProvider / hooks from the published .d.ts (see #native types).
        if (normalized.endsWith('/src/index.native.d.ts')) {
          return {
            filePath: path.resolve(__dirname, 'dist/mobile/index.native.d.ts'),
            content,
          };
        }
        if (normalized.endsWith('/src/components/index.native.d.ts')) {
          return {
            filePath: path.resolve(__dirname, 'dist/mobile/components/index.native.d.ts'),
            content,
          };
        }
        return { filePath, content };
      },
    }),
  ],
  build: {
    commonjsOptions: {
      include: [/node_modules/, /dist\/mobile/],
    },
    emptyOutDir: false,
    outDir: 'dist/mobile',
    lib: {
      entry: 'src/index.native.ts',
      formats: ['es'],
      name: 'DesignSystemNative',
      fileName: () => 'design-system.es.js',
    },
    rollupOptions: {
      // react-native-svg must stay external
      external: ['react', 'react-native-svg', /^react-native(?:\/|$)/],
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
