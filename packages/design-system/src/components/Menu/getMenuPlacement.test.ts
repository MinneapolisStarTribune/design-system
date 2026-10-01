import { describe, expect, it } from 'vitest';
import { getMenuPlacement, resolveMenuArrowOffset } from './getMenuPlacement';

describe('getMenuPlacement', () => {
  it('defaults to bottom-start', () => {
    expect(getMenuPlacement()).toBe('bottom-start');
  });

  it.each([
    [
      { vertical: 'bottom', horizontal: 'left' },
      { vertical: 'top', horizontal: 'left' },
      'bottom-start',
    ],
    [
      { vertical: 'bottom', horizontal: 'right' },
      { vertical: 'top', horizontal: 'right' },
      'bottom-end',
    ],
    [
      { vertical: 'bottom', horizontal: 'center' },
      { vertical: 'top', horizontal: 'center' },
      'bottom',
    ],
    [
      { vertical: 'top', horizontal: 'left' },
      { vertical: 'bottom', horizontal: 'left' },
      'top-start',
    ],
    [
      { vertical: 'top', horizontal: 'right' },
      { vertical: 'bottom', horizontal: 'right' },
      'top-end',
    ],
    [
      { vertical: 'top', horizontal: 'right' },
      { vertical: 'top', horizontal: 'left' },
      'right-start',
    ],
    [
      { vertical: 'bottom', horizontal: 'right' },
      { vertical: 'bottom', horizontal: 'left' },
      'right-end',
    ],
    [
      { vertical: 'center', horizontal: 'right' },
      { vertical: 'center', horizontal: 'left' },
      'right',
    ],
    [
      { vertical: 'top', horizontal: 'left' },
      { vertical: 'top', horizontal: 'right' },
      'left-start',
    ],
    [
      { vertical: 'bottom', horizontal: 'left' },
      { vertical: 'bottom', horizontal: 'right' },
      'left-end',
    ],
  ] as const)('maps %o + %o to %s', (anchorOrigin, transformOrigin, expected) => {
    expect(getMenuPlacement(anchorOrigin, transformOrigin)).toBe(expected);
  });

  it('prefers the vertical side when both axes are opposite', () => {
    expect(
      getMenuPlacement(
        { vertical: 'bottom', horizontal: 'right' },
        { vertical: 'top', horizontal: 'left' }
      )
    ).toBe('bottom-start');
  });

  it('opens below when the origins would cover the anchor', () => {
    expect(
      getMenuPlacement(
        { vertical: 'top', horizontal: 'left' },
        { vertical: 'top', horizontal: 'left' }
      )
    ).toBe('bottom-start');
  });

  it('leaves the arrow unpinned by default so it aims at the anchor', () => {
    expect(resolveMenuArrowOffset(undefined, 'bottom-start')).toBeNull();
    expect(resolveMenuArrowOffset(null, 'bottom-end')).toBeNull();
  });

  it.each([
    // FloatingArrow measures from the start edge for start-aligned and centred placements...
    ['start', 'bottom-start', '16px'],
    ['end', 'bottom-start', 'calc(100% - 28px)'],
    ['start', 'right', '16px'],
    ['end', 'right', 'calc(100% - 28px)'],
    // ...and from the end edge for end-aligned placements.
    ['start', 'bottom-end', 'calc(100% - 28px)'],
    ['end', 'bottom-end', '16px'],
    ['center', 'bottom-start', 'calc(50% - 6px)'],
    ['center', 'right-end', 'calc(50% - 6px)'],
  ] as const)('resolves %o on %s to %s', (offset, placement, expected) => {
    expect(resolveMenuArrowOffset(offset, placement)).toBe(expected);
  });

  it.each([
    ['24px', '24px'],
    ['35%', '35%'],
    ['calc(100% - 39px)', 'calc(100% - 39px)'],
    [18, 18],
  ] as const)('passes custom offset %o through', (offset, expected) => {
    expect(resolveMenuArrowOffset(offset, 'bottom-start')).toBe(expected);
  });
});
