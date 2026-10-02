import { describe, expect, it } from 'vitest';
import type { MiddlewareState, Placement } from '@floating-ui/react';
import { getMenuOriginPosition } from './menuOrigin';
import type { MenuOrigin } from './Menu.types';

const GAP = 13;
const reference = { x: 0, y: 0, width: 100, height: 40 };
const floating = { x: 0, y: 0, width: 200, height: 120 };

const origin = (vertical: MenuOrigin['vertical'], horizontal: MenuOrigin['horizontal']) => ({
  vertical,
  horizontal,
});

/** Runs the offset function the way Floating UI's `offset` middleware would. */
const resolveOffset = (
  anchorOrigin: MenuOrigin,
  transformOrigin: MenuOrigin,
  placement?: Placement
) => {
  const position = getMenuOriginPosition(anchorOrigin, transformOrigin, GAP);
  if (typeof position.offset !== 'function') throw new Error('Expected an offset function');
  const state: Pick<MiddlewareState, 'rects' | 'placement'> = {
    rects: { reference, floating },
    placement: placement ?? position.placement,
  };
  // The offset function reads only `rects` and `placement`.
  return { ...position, value: position.offset(state as MiddlewareState) };
};

describe('getMenuOriginPosition', () => {
  it.each([
    [origin('bottom', 'left'), origin('top', 'left'), 'bottom-start'],
    [origin('bottom', 'center'), origin('top', 'center'), 'bottom'],
    [origin('bottom', 'right'), origin('top', 'right'), 'bottom-end'],
    [origin('top', 'left'), origin('bottom', 'left'), 'top-start'],
    [origin('top', 'right'), origin('top', 'left'), 'right-start'],
    [origin('bottom', 'left'), origin('bottom', 'right'), 'left-end'],
  ] as const)('maps %o to %o as %s with no cross offset', (anchor, transform, placement) => {
    const { placement: resolved, coversAnchor, value } = resolveOffset(anchor, transform);

    expect(resolved).toBe(placement);
    expect(coversAnchor).toBe(false);
    expect(value).toEqual({ mainAxis: GAP, crossAxis: 0 });
  });

  it('shifts along the cross axis when the origins differ on it', () => {
    // The menu's left edge aligns with the anchor's right edge, below the anchor.
    expect(resolveOffset(origin('bottom', 'right'), origin('top', 'left')).value).toEqual({
      mainAxis: GAP,
      crossAxis: 100,
    });
    // The menu is centered on the anchor's left edge.
    expect(resolveOffset(origin('bottom', 'left'), origin('top', 'center')).value).toEqual({
      mainAxis: GAP,
      crossAxis: -50,
    });
  });

  it('keeps the cross offset and gap when flip moves the menu to the opposite side', () => {
    expect(
      resolveOffset(origin('bottom', 'right'), origin('top', 'left'), 'top-start').value
    ).toEqual({ mainAxis: GAP, crossAxis: 100 });
  });

  it('places the menu over the anchor without a gap when the origins overlap', () => {
    // MUI's "open over the anchor" case: the two top-left corners meet.
    const { placement, coversAnchor, value } = resolveOffset(
      origin('top', 'left'),
      origin('top', 'left')
    );

    expect(placement).toBe('bottom-start');
    expect(coversAnchor).toBe(true);
    expect(value).toEqual({ mainAxis: -40, crossAxis: 0 });
  });

  it('centers the menu on the anchor center', () => {
    const { placement, coversAnchor, value } = resolveOffset(
      origin('center', 'center'),
      origin('center', 'center')
    );

    expect(placement).toBe('bottom');
    expect(coversAnchor).toBe(true);
    // The menu moves up by half the anchor height plus half the menu height. 'bottom' already centers it horizontally.
    expect(value).toEqual({ mainAxis: -80, crossAxis: 0 });
  });

  it('lands on the same spot over the anchor whichever side flip tries', () => {
    const below = resolveOffset(origin('top', 'left'), origin('top', 'left')).value;
    const above = resolveOffset(origin('top', 'left'), origin('top', 'left'), 'top-start').value;

    // bottom-start starts at y = 40 and top-start starts at y = -120. Both offsets move the menu to y = 0.
    expect(below).toEqual({ mainAxis: -40, crossAxis: 0 });
    expect(above).toEqual({ mainAxis: -120, crossAxis: 0 });
  });
});
