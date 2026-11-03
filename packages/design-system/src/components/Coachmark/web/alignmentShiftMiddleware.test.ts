import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MiddlewareState, Placement } from '@floating-ui/react';
import { alignmentShift } from './alignmentShiftMiddleware';

const { detectOverflowMock } = vi.hoisted(() => ({ detectOverflowMock: vi.fn() }));

vi.mock('@floating-ui/react', async () => {
  const actual = await vi.importActual<typeof import('@floating-ui/react')>('@floating-ui/react');
  return { ...actual, detectOverflow: detectOverflowMock };
});

const FLOATING_WIDTH = 200;

function buildState(
  // The *real* floating-ui placement, not Coachmark's own position name -- floating-ui only ever
  // produces 'start'/'end' alignment suffixes (e.g. 'bottom-end'), never 'left'/'right' literally.
  // Coachmark's 'bottom-left' maps to floating-ui's 'bottom-end', 'bottom-right' to 'bottom-start'
  // (see PLACEMENT in Coachmark.tsx -- the suffixes are intentionally inverted from floating-ui's
  // own start/end so the card visually sits on the *named* side).
  placement: Placement,
  overflow: { top?: number; bottom?: number; left?: number; right?: number },
  extra: Partial<MiddlewareState> = {}
): MiddlewareState {
  detectOverflowMock.mockResolvedValueOnce({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    ...overflow,
  });

  return {
    x: 100,
    y: 50,
    placement,
    initialPlacement: placement,
    strategy: 'fixed',
    middlewareData: {},
    elements: {} as MiddlewareState['elements'],
    rects: {
      reference: { x: 0, y: 0, width: 40, height: 32 },
      floating: { x: 100, y: 50, width: FLOATING_WIDTH, height: 120 },
    },
    platform: {} as MiddlewareState['platform'],
    ...extra,
  };
}

describe('alignmentShift', () => {
  // mockResolvedValueOnce queues are FIFO across the whole file -- a value queued by a test whose
  // code path never actually calls detectOverflow (e.g. the no-alignment no-ops below) would
  // otherwise sit unconsumed and get picked up by a later, unrelated test instead of its own.
  beforeEach(() => {
    detectOverflowMock.mockReset();
  });

  it.each(['top', 'bottom', 'left', 'right'] as const)(
    'is a no-op for placement %s (no alignment axis to shift/flip)',
    async (placement) => {
      const middleware = alignmentShift();
      const result = await middleware.fn(buildState(placement, { left: 500 }));

      expect(result).toEqual({});
      expect(detectOverflowMock).not.toHaveBeenCalled();
    }
  );

  it('is a no-op when the card already fits (no overflow)', async () => {
    const middleware = alignmentShift();
    // 'bottom-end' = Coachmark's 'bottom-left'
    const result = await middleware.fn(buildState('bottom-end', { left: 0 }));

    expect(result).toEqual({});
  });

  it("shifts right by the exact overflow when within the 40% budget (Coachmark's bottom-left)", async () => {
    const middleware = alignmentShift();
    const overflow = FLOATING_WIDTH * 0.2; // 20%, under the 40% cap
    const result = await middleware.fn(buildState('bottom-end', { left: overflow }));

    expect(result).toEqual({ x: 100 + overflow });
  });

  it("flips Coachmark's bottom-left to bottom-right when overflow exceeds the 40% budget", async () => {
    const middleware = alignmentShift();
    const overflow = FLOATING_WIDTH * 0.5; // 50%, over the 40% cap
    // 'bottom-end' (bottom-left) should flip to 'bottom-start' (bottom-right)
    const result = await middleware.fn(buildState('bottom-end', { left: overflow }));

    expect(result).toEqual({
      data: { flipped: true },
      reset: { placement: 'bottom-start' },
    });
  });

  it("flips Coachmark's bottom-right to bottom-left when overflow exceeds the 40% budget", async () => {
    const middleware = alignmentShift();
    const overflow = FLOATING_WIDTH * 0.5;
    // 'bottom-start' (bottom-right) should flip to 'bottom-end' (bottom-left)
    const result = await middleware.fn(buildState('bottom-start', { right: overflow }));

    expect(result).toEqual({
      data: { flipped: true },
      reset: { placement: 'bottom-end' },
    });
  });

  it("flips Coachmark's top-left to top-right the same way as bottom-left", async () => {
    const middleware = alignmentShift();
    const overflow = FLOATING_WIDTH * 0.5;
    const result = await middleware.fn(buildState('top-end', { left: overflow }));

    expect(result).toEqual({
      data: { flipped: true },
      reset: { placement: 'top-start' },
    });
  });

  it('caps the shift at 40% instead of flipping again once already flipped this cycle', async () => {
    const middleware = alignmentShift();
    const overflow = FLOATING_WIDTH * 0.5; // still over budget post-flip
    const state = buildState(
      'bottom-start',
      { right: overflow },
      { middlewareData: { alignmentShift: { flipped: true } } }
    );

    const result = await middleware.fn(state);

    expect(result).toEqual({ x: 100 - FLOATING_WIDTH * 0.4 });
  });

  it('shifts by exactly the 40% cap when overflow lands precisely on the boundary', async () => {
    const middleware = alignmentShift();
    const overflow = FLOATING_WIDTH * 0.4;
    const result = await middleware.fn(buildState('bottom-end', { left: overflow }));

    expect(result).toEqual({ x: 100 + overflow });
  });
});
