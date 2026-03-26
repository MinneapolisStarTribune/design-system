import { describe, it } from 'vitest';
import { ArrowRightIcon } from '@/icons';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { Link } from './Link';

describe('Link Accessibility', () => {
  it('has no violations for default link', async () => {
    await expectNoA11yViolations(
      <Link size="medium" href="https://example.com">
        Read more
      </Link>
    );
  });

  it('has no violations when disabled', async () => {
    await expectNoA11yViolations(
      <Link size="medium" href="https://example.com" disabled>
        Unavailable
      </Link>
    );
  });

  it('has no violations with trailing icon', async () => {
    const { checkA11y } = await renderAndCheckA11y(
      <Link
        size="medium"
        href="https://example.com"
        icon={<ArrowRightIcon />}
        iconPosition="end"
      >
        Continue
      </Link>
    );
    await checkA11y();
  });

  it('has no violations with leading icon', async () => {
    const { checkA11y } = await renderAndCheckA11y(
      <Link
        size="small"
        href="https://example.com"
        icon={<ArrowRightIcon />}
        iconPosition="start"
      >
        Back
      </Link>
    );
    await checkA11y();
  });
});
