import { vi } from 'vitest';

// A no-op stub middleware -- only the call *arguments* matter for this test, not the positioning
// math itself (jsdom has no real layout, so every element's rect is zero regardless).
const { shiftSpy, arrowSpy, alignmentShiftSpy } = vi.hoisted(() => {
  const stubMiddleware = (name: string) => (options: Record<string, unknown>) => ({
    name,
    options,
    async fn() {
      return {};
    },
  });
  return {
    shiftSpy: vi.fn(stubMiddleware('shift')),
    arrowSpy: vi.fn(stubMiddleware('arrow')),
    alignmentShiftSpy: vi.fn(stubMiddleware('alignmentShift')),
  };
});

vi.mock('@floating-ui/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@floating-ui/react')>()),
  shift: shiftSpy,
  arrow: arrowSpy,
}));
vi.mock('./alignmentShiftMiddleware', () => ({ alignmentShift: alignmentShiftSpy }));

import { screen } from '@testing-library/react';
import { Coachmark } from './Coachmark';
import { Button } from '@/components/Button/web/Button';
import { renderWithProvider } from '../../../test-utils/render';

describe("Coachmark's edge-hugging padding", () => {
  it("gives shift the same (smaller) edge padding as alignmentShift, not the card's own larger sizing margin", () => {
    renderWithProvider(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
        position="bottom-right"
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(shiftSpy).toHaveBeenCalled();
    expect(alignmentShiftSpy).toHaveBeenCalled();
    expect(arrowSpy).toHaveBeenCalled();

    const shiftPadding = (shiftSpy.mock.calls[0][0] as { padding: number }).padding;
    const alignmentShiftPadding = (alignmentShiftSpy.mock.calls[0][0] as { padding: number })
      .padding;
    const arrowPadding = (arrowSpy.mock.calls[0][0] as { padding: number }).padding;

    // shift runs *after* alignmentShift and re-clamps the card's position using its own padding --
    // if it were larger than alignmentShift's, it would silently override whatever edge-hugging
    // position alignmentShift computed, undoing it. This is exactly the regression this guards:
    // shift previously reused the larger VIEWPORT_EDGE_PADDING meant for sizing the card itself.
    expect(shiftPadding).toBe(alignmentShiftPadding);

    // The arrow's own corner-avoidance padding is a separate, independent concern -- it just needs
    // to exist (previously it was unset/0, letting the arrow slide flush into the card's corner).
    expect(arrowPadding).toBeGreaterThan(0);
  });
});
