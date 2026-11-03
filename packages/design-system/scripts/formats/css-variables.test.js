/**
 * Tests for the Style Dictionary `css/variables` format (`css-variables.js`).
 *
 * @vitest-environment node
 */

import { describe, it, expect } from 'vitest';
import cssVariablesFormat from './css-variables.js';

const dictionary = {
  allTokens: [
    { name: 'color-background-light-default', value: '#0D0D0D' },
    { name: 'color-color-icon-on-light-primary', value: '#ffffff' },
  ],
};

describe('cssVariablesFormat', () => {
  it('declares variables on :root by default', () => {
    expect(cssVariablesFormat({ dictionary })).toBe(
      '/**\n * Do not edit directly, this file was auto-generated.\n */\n' +
        ':root {\n  --color-background-light-default: #0D0D0D;\n  --color-icon-on-light-primary: #ffffff;\n}\n'
    );
  });

  it('declares variables and color-scheme on a custom selector', () => {
    const output = cssVariablesFormat({
      dictionary,
      options: { selector: "[data-theme='dark']", colorScheme: 'dark' },
    });

    expect(output).not.toContain(':root');
    expect(output).toContain(
      "[data-theme='dark'] {\n  color-scheme: dark;\n  --color-background-light-default: #0D0D0D;\n"
    );
  });
});
