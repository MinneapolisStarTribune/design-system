import { vi } from 'vitest';

const autoUpdateSpy = vi.hoisted(() => vi.fn(() => () => {}));

vi.mock('@floating-ui/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@floating-ui/react')>()),
  autoUpdate: autoUpdateSpy,
}));

import { screen } from '@testing-library/react';
import { Coachmark } from './Coachmark';
import { Button } from '@/components/Button/web/Button';
import { renderWithProvider } from '@/test-utils/render';

describe("Coachmark's trackReferenceMovement prop", () => {
  it('defaults autoUpdate to event-based (not per-frame) repositioning', () => {
    renderWithProvider(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(autoUpdateSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.any(Function),
      { animationFrame: false }
    );
  });

  it('switches autoUpdate to per-frame repositioning when set', () => {
    renderWithProvider(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
        trackReferenceMovement
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(autoUpdateSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.any(Function),
      { animationFrame: true }
    );
  });
});
