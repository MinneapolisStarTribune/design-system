import { expectNoA11yViolations } from '@/test-utils/a11y';
import { ArticleBodySponsoredText } from './ArticleBodySponsoredText';

describe('ArticleBodySponsoredText Accessibility', () => {
  describe('static rendering', () => {
    it('has no accessibility violations with default props', async () => {
      await expectNoA11yViolations(
        <ArticleBodySponsoredText>Default article body sponsored text</ArticleBodySponsoredText>
      );
    });

    it('applies the correct class for weight', async () => {
      await expectNoA11yViolations(
        <>
          <ArticleBodySponsoredText weight="regular">Regular text</ArticleBodySponsoredText>
          <ArticleBodySponsoredText weight="italic">Italic text</ArticleBodySponsoredText>
          <ArticleBodySponsoredText weight="semibold">Semibold text</ArticleBodySponsoredText>
          <ArticleBodySponsoredText weight="semibold-italic">
            Semibold Italic text
          </ArticleBodySponsoredText>
        </>
      );
    });
  });

  it('has no accessibility violations with custom className', async () => {
    await expectNoA11yViolations(
      <ArticleBodySponsoredText className="custom-class">
        Custom class article body sponsored text
      </ArticleBodySponsoredText>
    );
  });
});
