import { expectNoA11yViolations } from '@/test-utils/a11y';
import { ArticleBodyText } from './ArticleBodyText';

describe('ArticleBodyText Accessibility', () => {
  it('has no accessibility violations with default props', async () => {
    await expectNoA11yViolations(<ArticleBodyText>Default article body text</ArticleBodyText>);
  });
});
