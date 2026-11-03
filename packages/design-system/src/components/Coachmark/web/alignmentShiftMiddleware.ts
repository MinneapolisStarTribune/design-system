import {
  detectOverflow,
  type Middleware,
  type MiddlewareState,
  type Placement,
} from '@floating-ui/react';

/** How much of the floating element's own width it may shift before flipping alignment instead. */
const MAX_ALIGNMENT_SHIFT_RATIO = 0.4;

export interface AlignmentShiftOptions {
  /** Forwarded to detectOverflow -- same boundary the other positioning middleware use. */
  boundary?: Element | null;
  /** Forwarded to detectOverflow -- same viewport-edge safety margin the other middleware use. */
  padding?: number;
}

/**
 * For a top/bottom placement with a 'start'/'end' alignment (Coachmark's -left/-right
 * positions), keeps the card looking anchored to its trigger when the viewport edge would
 * otherwise clip it: shifts it back into view along the alignment axis by up to 40% of its own
 * width, and only flips to the opposite alignment (e.g. bottom-left -> bottom-right) once that
 * budget is exceeded -- rather than either shifting it arbitrarily far from the trigger, or
 * flipping immediately the moment it touches the edge.
 *
 * 'top-center'/'bottom-center' (no alignment) and 'center-left'/'center-right' (not a top/bottom
 * side) don't have an alignment axis in this sense and are left untouched.
 *
 * Must run after `flip` (side) and, if flipping alignment, will cause floating-ui to reset and
 * re-run the middleware pipeline once for the new placement -- guarded by `middlewareData` so it
 * flips at most once per position computation rather than potentially toggling back and forth
 * (floating-ui's own MAX_RESET_COUNT is a backstop, not something this relies on).
 */
export function alignmentShift(options: AlignmentShiftOptions = {}): Middleware {
  return {
    name: 'alignmentShift',
    options,
    async fn(state: MiddlewareState) {
      const { placement, rects, x, middlewareData } = state;
      const [side, alignment] = placement.split('-') as [string, 'start' | 'end' | undefined];

      if (alignment == null || (side !== 'top' && side !== 'bottom')) {
        return {};
      }

      const overflow = await detectOverflow(state, {
        boundary: options.boundary ?? undefined,
        padding: options.padding ?? 0,
      });

      // 'end' alignment is Coachmark's '-left' positions (the card sits toward/extends past the
      // trigger's left side, per PLACEMENT's inverted start/end mapping) -- the viewport's left
      // edge is what can clip it. 'start' ('-right' positions) is the mirror, against the right
      // edge.
      const relevantOverflow = alignment === 'end' ? overflow.left : overflow.right;

      if (relevantOverflow <= 0) {
        return {};
      }

      const maxShift = rects.floating.width * MAX_ALIGNMENT_SHIFT_RATIO;
      const alreadyFlipped = middlewareData.alignmentShift?.flipped === true;

      if (relevantOverflow > maxShift && !alreadyFlipped) {
        const flippedAlignment = alignment === 'end' ? 'start' : 'end';
        return {
          data: { flipped: true },
          reset: { placement: `${side}-${flippedAlignment}` as Placement },
        };
      }

      const cappedOverflow = Math.min(relevantOverflow, maxShift);
      const delta = alignment === 'end' ? cappedOverflow : -cappedOverflow;
      return { x: x + delta };
    },
  };
}
