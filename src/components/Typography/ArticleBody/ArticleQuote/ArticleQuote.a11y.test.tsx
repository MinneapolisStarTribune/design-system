import { expectNoA11yViolations } from '@/test-utils/a11y';
import { ArticleQuote } from './web/ArticleQuote';

describe('ArticleQuote Accessibility', () => {
  describe('static rendering', () => {
    it('has no accessibility violations with default props', async () => {
      await expectNoA11yViolations(
        <ArticleQuote>Highlight key statements or examples within an article.</ArticleQuote>
      );
    });

    it('has no accessibility violations with all sizes', async () => {
      await expectNoA11yViolations(
        <>
          <ArticleQuote size="small">Small quote — use sparingly.</ArticleQuote>
          <ArticleQuote size="large">Large quote — visual emphasis for key moments.</ArticleQuote>
        </>
      );
    });

    it('has no accessibility violations with custom className', async () => {
      await expectNoA11yViolations(
        <ArticleQuote className="custom-class">Custom class article quote</ArticleQuote>
      );
    });
  });
});
