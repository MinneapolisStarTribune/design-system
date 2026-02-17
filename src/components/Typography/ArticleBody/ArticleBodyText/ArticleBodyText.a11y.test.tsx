import { expectNoA11yViolations } from '@/test-utils/a11y';
import { ArticleBodyText } from './ArticleBodyText';

describe('ArticleBodyText Accessibility', () => {
  describe('static rendering', () => {
    it('has no accessibility violations with default props', async () => {
      await expectNoA11yViolations(<ArticleBodyText>Default article body text</ArticleBodyText>);
    });

    it('has no accessibility violations with all weights', async () => {
      await expectNoA11yViolations(
        <>
          <ArticleBodyText weight="regular">Regular text</ArticleBodyText>
          <ArticleBodyText weight="italic">Italic text</ArticleBodyText>
          <ArticleBodyText weight="bold">Bold text</ArticleBodyText>
          <ArticleBodyText weight="bold-italic">Bold Italic text</ArticleBodyText>
          <ArticleBodyText weight="dropcap">Dropcap text</ArticleBodyText>
        </>
      );
    });

    it('has no accessibility violations with custom className', async () => {
      await expectNoA11yViolations(
        <ArticleBodyText className="custom-class">Custom class article body text</ArticleBodyText>
      );
    });
  });
});
