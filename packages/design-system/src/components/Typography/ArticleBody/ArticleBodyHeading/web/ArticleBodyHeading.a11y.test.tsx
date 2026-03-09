import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { ArticleBodyHeading } from './ArticleBodyHeading';

describe('ArticleBodyHeading Accessibility', () => {
  it('has no accessibility violations with default props', async () => {
    await expectNoA11yViolations(
      <ArticleBodyHeading importance={1}>Article Body Heading</ArticleBodyHeading>
    );
  });
});
