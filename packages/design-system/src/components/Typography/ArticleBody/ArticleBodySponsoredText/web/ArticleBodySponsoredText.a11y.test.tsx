import { expectNoA11yViolations } from '@/test-utils/a11y';
import { ArticleBodySponsoredText } from './ArticleBodySponsoredText';

describe('ArticleBodySponsoredText Accessibility', () => {
  it('has no accessibility violations with default props', async () => {
    await expectNoA11yViolations(
      <ArticleBodySponsoredText>Default article body sponsored text</ArticleBodySponsoredText>
    );
  });
});
