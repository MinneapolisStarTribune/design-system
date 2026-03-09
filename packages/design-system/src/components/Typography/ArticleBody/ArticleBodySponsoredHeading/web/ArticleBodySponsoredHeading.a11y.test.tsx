import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { ArticleBodySponsoredHeading } from './ArticleBodySponsoredHeading';

describe('ArticleBodySponsoredHeading Accessibility', () => {
  it('has no accessibility violations with default props', async () => {
    await expectNoA11yViolations(
      <ArticleBodySponsoredHeading importance={1}>
        Sponsored Article Title
      </ArticleBodySponsoredHeading>
    );
  });
});
