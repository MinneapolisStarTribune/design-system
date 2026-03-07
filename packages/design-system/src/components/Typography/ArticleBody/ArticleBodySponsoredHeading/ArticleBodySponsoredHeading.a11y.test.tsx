import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { ArticleBodySponsoredHeading } from './ArticleBodySponsoredHeading';

describe('ArticleBodySponsoredHeading Accessibility', () => {
  it('has no violations for each heading level (importance 1–6)', async () => {
    await expectNoA11yViolations(
      <main>
        <ArticleBodySponsoredHeading importance={1}>Heading 1</ArticleBodySponsoredHeading>
        <ArticleBodySponsoredHeading importance={2}>Heading 2</ArticleBodySponsoredHeading>
        <ArticleBodySponsoredHeading importance={3}>Heading 3</ArticleBodySponsoredHeading>
        <ArticleBodySponsoredHeading importance={4}>Heading 4</ArticleBodySponsoredHeading>
        <ArticleBodySponsoredHeading importance={5}>Heading 5</ArticleBodySponsoredHeading>
        <ArticleBodySponsoredHeading importance={6}>Heading 6</ArticleBodySponsoredHeading>
      </main>
    );
  });

  it('has no violations with id and aria-label', async () => {
    await expectNoA11yViolations(
      <ArticleBodySponsoredHeading importance={1} id="page-title" aria-label="Page title">
        Sponsored Article Title
      </ArticleBodySponsoredHeading>
    );
  });

  it('has no violations with custom className', async () => {
    await expectNoA11yViolations(
      <ArticleBodySponsoredHeading importance={2} className="custom-heading">
        Styled heading
      </ArticleBodySponsoredHeading>
    );
  });
});
