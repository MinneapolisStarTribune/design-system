import { describe, expect, it } from 'vitest';
import { resolveArrowOffset } from './floatingPopup';

const ARROW = { width: 12, height: 9, cornerInset: 16 };

describe('resolveArrowOffset', () => {
  it('leaves the arrow unpinned by default so it aims at the anchor', () => {
    expect(resolveArrowOffset(undefined, 'bottom-start', ARROW)).toBeNull();
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
    expect(resolveArrowOffset(offset, placement, ARROW)).toBe(expected);
  });

  it('uses the arrow width and corner inset it is given', () => {
    const popoverArrow = { width: 16, height: 8, cornerInset: 0 };
    expect(resolveArrowOffset('start', 'bottom', popoverArrow)).toBe('0px');
    expect(resolveArrowOffset('end', 'bottom', popoverArrow)).toBe('calc(100% - 16px)');
  });
});
