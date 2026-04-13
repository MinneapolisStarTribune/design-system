const path = require('path');

const rootNodeModules = path.resolve(__dirname, '../../node_modules');

/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  testMatch: [
    '**/*.native.test.tsx',
    '**/*.native.a11y.test.tsx',
  ],
  moduleDirectories: ['node_modules', rootNodeModules],
  moduleNameMapper: {
    '\\.svg\\?react$': '<rootDir>/src/test-utils/mocks/svgReactStub.tsx',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@mobile/themes/(.*)$': '<rootDir>/dist/mobile/themes/$1',
    '^@mobile/typography/(.*)$': '<rootDir>/dist/mobile/typography/$1',
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@testing-library/react-native)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
