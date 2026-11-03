import { vi } from 'vitest';

// A no-op stub -- only call *arguments* matter here, not real positioning (jsdom has no layout).
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
import { renderWithProvider } from '@/test-utils/render';

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

    // shift runs after alignmentShift and re-clamps using its own padding -- if larger, it'd
    // silently override alignmentShift's edge-hugging result (the regression this guards against).
    expect(shiftPadding).toBe(alignmentShiftPadding);

    // Just needs to exist -- previously unset, letting the arrow slide flush into the corner.
    expect(arrowPadding).toBeGreaterThan(0);
  });
});
