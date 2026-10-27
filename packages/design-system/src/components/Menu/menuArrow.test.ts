import { describe, expect, it } from 'vitest';
import { resolveMenuArrowPosition } from './menuArrow';

describe('resolveMenuArrowPosition', () => {
  it('leaves the arrow unpinned by default so it aims at the anchor', () => {
    expect(resolveMenuArrowPosition(undefined, 'bottom-start')).toBeNull();
  });

  it.each([
    ['start', 'bottom-start', '25px'],
    ['end', 'bottom-start', 'calc(100% - 39px)'],
    ['start', 'right', '25px'],
    ['end', 'right', 'calc(100% - 39px)'],
    ['start', 'bottom-end', 'calc(100% - 39px)'],
    ['end', 'bottom-end', '25px'],
    ['center', 'bottom-start', 'calc(50% - 7px)'],
    ['center', 'right-end', 'calc(50% - 7px)'],
  ] as const)('resolves %o on %s to %s', (position, placement, expected) => {
    expect(resolveMenuArrowPosition(position, placement)).toBe(expected);
  });
});
