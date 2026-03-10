/**
 * Chromatic modes for visual regression testing.
 * Each mode defines globals (brand, theme) that our decorator reads to render
 * the correct brand/theme combination. Chromatic captures a snapshot for each mode.
 */
export const allModes = {
  'star-tribune-light': {
    brand: 'startribune',
    theme: 'light',
  },
  'star-tribune-dark': {
    brand: 'startribune',
    theme: 'dark',
  },
  'varsity-light': {
    brand: 'varsity',
    theme: 'light',
  },
  'varsity-dark': {
    brand: 'varsity',
    theme: 'dark',
  },
} as const;
