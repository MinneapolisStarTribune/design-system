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
    '^react-native-svg$': '<rootDir>/src/test-utils/mocks/react-native-svg.tsx',
    '^react-native-webview$': '<rootDir>/src/test-utils/mocks/react-native-webview.tsx',
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-svg|@testing-library/react-native|react-native-webview)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
