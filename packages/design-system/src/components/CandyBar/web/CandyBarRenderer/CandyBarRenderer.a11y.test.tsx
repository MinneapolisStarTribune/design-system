import { describe, it, vi } from 'vitest';
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { CandyBarRenderer } from './CandyBarRenderer';

describe('CandyBarRenderer Accessibility', () => {
  it('has no violations when mounted with simple content', async () => {
    const onDismiss = vi.fn();
    await expectNoA11yViolations(
      <CandyBarRenderer
        activeItem={{ id: 'a11y-1', children: <span>Notice text</span> }}
        onDismiss={onDismiss}
        aria-label="Test site notice"
      />
    );
  });
});
