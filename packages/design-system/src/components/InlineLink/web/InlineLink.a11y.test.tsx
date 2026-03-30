import { describe, it } from 'vitest';
import { ArticleBodyText } from '@/components/Typography/ArticleBody/ArticleBodyText/web/ArticleBodyText';
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { InlineLink } from './InlineLink';

describe('InlineLink Accessibility', () => {
  it('has no violations in article body', async () => {
    await expectNoA11yViolations(
      <ArticleBodyText>
        See{' '}
        <InlineLink brand="startribune" href="https://example.com">
          this link
        </InlineLink>{' '}
        for more.
      </ArticleBodyText>
    );
  });

  it('has no violations when disabled', async () => {
    await expectNoA11yViolations(
      <ArticleBodyText>
        <InlineLink brand="varsity" href="https://example.com" disabled>
          Unavailable
        </InlineLink>
      </ArticleBodyText>
    );
  });
});
