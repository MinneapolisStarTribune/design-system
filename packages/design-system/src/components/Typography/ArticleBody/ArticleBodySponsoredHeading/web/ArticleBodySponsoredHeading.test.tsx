import { describe, it, expect } from 'vitest';
import { ArticleBodySponsoredHeading } from './ArticleBodySponsoredHeading';
import { renderWithProvider } from '@/test-utils/render';
import { ARTICLE_BODY_SPONSORED_HEADING_IMPORTANCE_LEVELS } from '../ArticleBodySponsoredHeading.types';

describe('ArticleBodySponsoredHeading', () => {
  it('renders with importance 1 (h1)', () => {
    const { getByRole } = renderWithProvider(
      <ArticleBodySponsoredHeading importance={1}>Heading text</ArticleBodySponsoredHeading>
    );

    const heading = getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Heading text');
    expect(heading).toHaveClass('typography-article-body-sponsored-h1');
  });

  it.each(ARTICLE_BODY_SPONSORED_HEADING_IMPORTANCE_LEVELS)(
    'renders correct element and class for importance %s',
    (importance) => {
      const { getByRole } = renderWithProvider(
        <ArticleBodySponsoredHeading importance={importance}>
          Level {importance}
        </ArticleBodySponsoredHeading>
      );

      const heading = getByRole('heading', { level: importance });

      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass(`typography-article-body-sponsored-h${importance}`);
    }
  );

  it('applies custom className', () => {
    const { getByRole } = renderWithProvider(
      <ArticleBodySponsoredHeading importance={1} className="custom-class">
        With custom class
      </ArticleBodySponsoredHeading>
    );

    const heading = getByRole('heading', { level: 1 });

    expect(heading).toHaveClass('typography-article-body-sponsored-h1');
    expect(heading).toHaveClass('custom-class');
  });

  it('passes through id and aria-label', () => {
    const { getByRole } = renderWithProvider(
      <ArticleBodySponsoredHeading importance={1} id="section-title" aria-label="Section title">
        Title
      </ArticleBodySponsoredHeading>
    );

    const heading = getByRole('heading', { level: 1 });

    expect(heading).toHaveAttribute('id', 'section-title');
    expect(heading).toHaveAttribute('aria-label', 'Section title');
  });

  it('renders without throwing when brand is startribune', () => {
    expect(() =>
      renderWithProvider(
        <ArticleBodySponsoredHeading importance={1}>Sponsored</ArticleBodySponsoredHeading>,
        { brand: 'startribune' }
      )
    ).not.toThrow();
  });

  it('throws when brand is varsity (ArticleBodySponsoredHeading is Star Tribune only)', () => {
    expect(() =>
      renderWithProvider(
        <ArticleBodySponsoredHeading importance={1}>Sponsored</ArticleBodySponsoredHeading>,
        { brand: 'varsity' }
      )
    ).toThrow();
  });
});
