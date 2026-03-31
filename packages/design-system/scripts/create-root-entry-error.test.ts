import * as path from 'path';
import { describe, it, expect } from 'vitest';

describe('package root entrypoint', () => {
  it('throws a helpful error when importing the package root', () => {
    // Ensure the root-entry error file has been generated.
    // This script writes dist/web/root-entry-error.cjs.js.
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- testing CJS require() behavior
    require('./create-root-entry-error.cjs');

    const rootEntryPath = path.resolve(__dirname, '../dist/web/root-entry-error.cjs.js');

    const expectedMessage =
      "@minneapolisstartribune/design-system: Import from '@minneapolisstartribune/design-system/web' " +
      "or '@minneapolisstartribune/design-system/native' instead of the package root.";

    // Requiring the root entry should immediately throw with the helpful message.
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- testing CJS require() behavior
    expect(() => require(rootEntryPath)).toThrowError(expectedMessage);
  });
});
