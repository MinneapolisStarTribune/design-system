import { expectNoA11yViolations } from '@/test-utils/a11y';
import { ArticleQuote } from './ArticleQuote';

describe('ArticleQuote Accessibility', () => {
  it('has no accessibility violations with default props', async () => {
    await expectNoA11yViolations(
      <ArticleQuote>Highlight key statements or examples within an article.</ArticleQuote>
    );
  });
});
