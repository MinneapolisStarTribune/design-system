import { describe, expect, it } from 'vitest';
import { resolveMenuArrowOffset } from './menuArrow';

describe('resolveMenuArrowOffset', () => {
  it('leaves the arrow unpinned by default so it aims at the anchor', () => {
    expect(resolveMenuArrowOffset(undefined, 'bottom-start')).toBeNull();
  });

  it.each([
    ['start', 'bottom-start', '16px'],
    ['end', 'bottom-start', 'calc(100% - 28px)'],
    ['start', 'right', '16px'],
    ['end', 'right', 'calc(100% - 28px)'],
    ['start', 'bottom-end', 'calc(100% - 28px)'],
    ['end', 'bottom-end', '16px'],
    ['center', 'bottom-start', 'calc(50% - 6px)'],
    ['center', 'right-end', 'calc(50% - 6px)'],
  ] as const)('resolves %o on %s to %s', (offset, placement, expected) => {
    expect(resolveMenuArrowOffset(offset, placement)).toBe(expected);
  });
});
