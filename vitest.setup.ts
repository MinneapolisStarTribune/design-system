import '@testing-library/jest-dom/vitest';
import * as matchers from "vitest-axe/matchers";
import "vitest-axe/extend-expect";
import { expect } from "vitest";

// Mock HTMLCanvasElement.getContext for axe-core color contrast checks
HTMLCanvasElement.prototype.getContext = (() => null) as any;

expect.extend(matchers);

