import { describe, it, expect } from 'vitest';
import { ArticleBodySponsoredHeading } from './ArticleBodySponsoredHeading';
import { renderWithProvider } from '@/test-utils/render';

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

  it('renders correct element and class for each importance level', () => {
    const levels = [1, 2, 3, 4, 5, 6] as const;

    levels.forEach((importance) => {
      const { getByRole, unmount } = renderWithProvider(
        <ArticleBodySponsoredHeading importance={importance}>
          Level {importance}
        </ArticleBodySponsoredHeading>
      );

      const heading = getByRole('heading', { level: importance });

      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass(`typography-article-body-sponsored-h${importance}`);

      unmount();
    });
  });

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
