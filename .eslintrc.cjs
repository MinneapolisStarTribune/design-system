module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'plugin:react/jsx-runtime', 'plugin:react-hooks/recommended', 'prettier', 'plugin:storybook/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', '@typescript-eslint', 'unicorn', 'unused-imports', 'simple-import-sort'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // TypeScript
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // React
    'react/prop-types': 'off', // Using TypeScript
    'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Code Quality
    'no-unused-expressions': 'error',
    'unused-imports/no-unused-imports': 'error',
    
    // Unicorn rules
    'unicorn/explicit-length-check': 'error',
    'unicorn/no-useless-spread': 'error',
    'unicorn/prefer-set-has': 'error',
    
    // General
    'no-console': ['warn', { allow: ['warn', 'error', 'trace'] }],
  },
  overrides: [
    {
      // Node scripts (CommonJS) - allow require
      files: ['scripts/**/*.js'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      // Test files
      files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    {
      // Storybook files
      files: ['**/*.stories.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      // Mantine theme and related files
      files: [
        '**/mantine-theme.ts',
        '**/theme-helpers.ts',
        '**/ThemeAwareColorCategory.tsx',
        '**/colorsData.ts',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
    {
      // Index files - sort exports alphabetically
      files: ['src/index.ts', 'src/components/index.ts'],
      rules: {
        'simple-import-sort/exports': 'error',
      },
    },
  ],
};

