import '@testing-library/jest-dom/vitest';
import * as matchers from 'vitest-axe/matchers';
import 'vitest-axe/extend-expect';
import { expect } from 'vitest';

// Suppress jsdom CSS parsing warnings - these are harmless
// jsdom tries to parse CSS but can't handle all features
const originalError = console.error;
console.error = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('Could not parse CSS stylesheet')) {
    return; // Suppress CSS parsing warnings
  }
  originalError(...args);
};

// Only setup DOM mocks if we're in jsdom environment
// Script tests use node environment and don't have these globals
if (typeof HTMLCanvasElement !== 'undefined') {
  // Mock HTMLCanvasElement.getContext for axe-core color contrast checks
  HTMLCanvasElement.prototype.getContext = (() => null) as any;
}

// Mock window.matchMedia for Mantine components that use responsive behavior
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {}, // deprecated
      removeListener: () => {}, // deprecated
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    }),
  });
}

expect.extend(matchers);
