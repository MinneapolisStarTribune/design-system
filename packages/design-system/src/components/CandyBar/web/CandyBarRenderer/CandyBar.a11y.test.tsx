import { describe, it, vi } from 'vitest';
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { CandyBar } from '../CandyBar';

describe('CandyBar Accessibility', () => {
  it('has no violations with simple content', async () => {
    await expectNoA11yViolations(
      <CandyBar onClose={vi.fn()}>
        <span>Site notice message</span>
      </CandyBar>
    );
  });
});
