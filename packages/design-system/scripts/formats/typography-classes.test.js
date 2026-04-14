/**
 * Tests for the Style Dictionary `css/typography-classes` format (`typography-classes.js`).
 *
 * In the repo, output is produced by `yarn tokens` (see `scripts/builders/build-tokens.js`), which
 * feeds typography JSON from `tokens/typography/**` and related sources through Style Dictionary.
 * These tests pass a minimal `dictionary` shape that mirrors resolved token output.
 *
 * Breakpoints: path segments named `desktop`, `tablet`, or `mobile` select which media query wraps
 * the rules. The min/max widths in those queries are fixed in `breakpointMap` in
 * `typography-classes.js`, not read from token values.
 *
 * @vitest-environment node
 */

import { describe, it, expect } from 'vitest';
import typographyClassesFormat from './typography-classes.js';

/** Mirrors `breakpointMap` in typography-classes.js — update both if breakpoints change. */
const TYPOGRAPHY_BREAKPOINT_MEDIA = {
  mobile: '@media (max-width: 767px)',
  tablet: '@media (min-width: 768px) and (max-width: 1159px)',
  desktop: '@media (min-width: 1160px)',
};

describe('typographyClassesFormat', () => {
  it('returns CSS classes for composite typography tokens (responsive path segment)', () => {
    // Token path includes `desktop` like editorial/utility JSON under tokens/typography/
    const css = typographyClassesFormat({
      dictionary: {
        tokens: {
          typography: {
            utility: {
              page: {
                h1: {
                  desktop: {
                    value: {
                      fontFamily: 'Nohemi, sans-serif',
                      fontWeight: 600,
                      fontSize: 46,
                      lineHeight: 1.1,
                      letterSpacing: '0.02em',
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    expect(css).toContain('/**\n * Do not edit directly, this file was auto-generated.\n */');
    expect(css).toContain(TYPOGRAPHY_BREAKPOINT_MEDIA.desktop);
    expect(css).toContain('  .typography-utility-page-h1 {');
    expect(css).toContain('    font-family: Nohemi, sans-serif;');
    expect(css).toContain('    font-weight: 600;');
    expect(css).toContain('    font-size: 46px;');
    expect(css).toContain('    line-height: 1.1;');
    expect(css).toContain('    letter-spacing: 0.02em;');
    expect(css).toContain('[class*="typography-"]');
    expect(css).toContain('color: var(--color-text-on-light-primary);');
  });

  it('maps mobile, tablet, and desktop path segments to hardcoded media queries (output order: mobile → tablet → desktop)', () => {
    const css = typographyClassesFormat({
      dictionary: {
        tokens: {
          typography: {
            utility: {
              sample: {
                mobile: {
                  value: { fontSize: 12 },
                },
                tablet: {
                  value: { fontSize: 14 },
                },
                desktop: {
                  value: { fontSize: 16 },
                },
              },
            },
          },
        },
      },
    });

    expect(css).toContain(TYPOGRAPHY_BREAKPOINT_MEDIA.mobile);
    expect(css).toContain(TYPOGRAPHY_BREAKPOINT_MEDIA.tablet);
    expect(css).toContain(TYPOGRAPHY_BREAKPOINT_MEDIA.desktop);

    const mobileIdx = css.indexOf(TYPOGRAPHY_BREAKPOINT_MEDIA.mobile);
    const tabletIdx = css.indexOf(TYPOGRAPHY_BREAKPOINT_MEDIA.tablet);
    const desktopIdx = css.indexOf(TYPOGRAPHY_BREAKPOINT_MEDIA.desktop);
    expect(mobileIdx).toBeLessThan(tabletIdx);
    expect(tabletIdx).toBeLessThan(desktopIdx);

    expect(css).toContain('  .typography-utility-sample {');
    expect(css).toContain('    font-size: 12px;');
    expect(css).toContain('    font-size: 14px;');
    expect(css).toContain('    font-size: 16px;');
  });

  it('returns a no-tokens message when typography is missing', () => {
    const out = typographyClassesFormat({
      dictionary: { tokens: {} },
    });
    expect(out).toContain('No typography tokens found');
    expect(out).not.toContain('[class*="typography-"]');
  });

  it('returns a no-tokens message when no composite typography tokens exist', () => {
    const out = typographyClassesFormat({
      dictionary: {
        tokens: {
          typography: {
            empty: {},
          },
        },
      },
    });
    expect(out).toContain('No typography tokens found');
  });

  it('generates non-responsive classes when the path has no breakpoint segment', () => {
    const out = typographyClassesFormat({
      dictionary: {
        tokens: {
          typography: {
            utility: {
              page: {
                caption: {
                  value: {
                    fontSize: 14,
                    lineHeight: 1.4,
                  },
                },
              },
            },
          },
        },
      },
    });

    expect(out).toContain('.typography-utility-page-caption {');
    expect(out).toContain('font-size: 14px;');
    expect(out).toContain('line-height: 1.4;');
    expect(out).not.toContain('@media');
  });

  it('resolves token reference strings from dictionary.tokens', () => {
    const out = typographyClassesFormat({
      dictionary: {
        tokens: {
          font: {
            family: {
              brand: { value: 'Brand Sans, sans-serif' },
            },
          },
          typography: {
            utility: {
              title: {
                value: {
                  fontFamily: '{font.family.brand}',
                },
              },
            },
          },
        },
      },
    });

    expect(out).toContain('font-family: Brand Sans, sans-serif;');
  });

  it('falls back to a CSS variable when a token reference cannot be resolved', () => {
    const out = typographyClassesFormat({
      dictionary: {
        tokens: {
          typography: {
            utility: {
              title: {
                value: {
                  fontFamily: '{missing.token.ref}',
                },
              },
            },
          },
        },
      },
    });

    expect(out).toContain('font-family: var(--missing-token-ref);');
  });
});
