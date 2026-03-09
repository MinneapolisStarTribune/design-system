import '@testing-library/react-native/build/matchers/extend-expect';

// RNTL v13 still uses react-test-renderer internally; v14 will drop it.
// See https://github.com/callstack/react-native-testing-library/discussions/1698
// Suppress the deprecation noise until then.
const originalError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('react-test-renderer is deprecated')
  ) {
    return;
  }
  originalError(...args);
};
