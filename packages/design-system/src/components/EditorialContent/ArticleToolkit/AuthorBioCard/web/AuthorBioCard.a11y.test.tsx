import { describe, it } from 'vitest';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';

import { AuthorBioCard } from './AuthorBioCard';

describe('AuthorBioCard Accessibility', () => {
  it('has no violations for minimal component', async () => {
    await expectNoA11yViolations(<AuthorBioCard description="Test description" />);
  });

  it('has no violations with full content', async () => {
    await expectNoA11yViolations(
      <AuthorBioCard
        label="Author"
        name="John Doe"
        position="Staff Writer"
        description="Bio content"
        thumbnailIcon="https://example.com/image.jpg"
        thumbnailIconAlt="John Doe"
        ctaLink={{ label: 'View profile', link: '#' }}
      />
    );
  });

  it('has no violations with CTA click handler', async () => {
    const { checkA11y } = await renderAndCheckA11y(
      <AuthorBioCard description="Test" ctaLink={{ label: 'Click', onClick: () => {} }} />
    );

    await checkA11y();
  });

  it('has no violations when image is present', async () => {
    const { checkA11y } = await renderAndCheckA11y(
      <AuthorBioCard
        description="Test"
        thumbnailIcon="https://example.com/image.jpg"
        thumbnailIconAlt="Author"
      />
    );

    await checkA11y();
  });

  it('has no violations with aria attributes', async () => {
    await expectNoA11yViolations(
      <AuthorBioCard description="Test" aria-label="author card" aria-describedby="desc" />
    );
  });
});
