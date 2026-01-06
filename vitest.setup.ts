import '@testing-library/jest-dom/vitest';
import * as matchers from "vitest-axe/matchers";
import "vitest-axe/extend-expect";
import { expect } from "vitest";

// Only setup DOM mocks if we're in jsdom environment
// Script tests use node environment and don't have these globals
if (typeof HTMLCanvasElement !== 'undefined') {
  // Mock HTMLCanvasElement.getContext for axe-core color contrast checks
  HTMLCanvasElement.prototype.getContext = (() => null) as any;
}

expect.extend(matchers);

