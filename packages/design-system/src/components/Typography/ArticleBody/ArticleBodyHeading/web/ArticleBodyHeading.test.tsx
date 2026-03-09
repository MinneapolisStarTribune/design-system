import { describe, it, expect } from 'vitest';
import { ArticleBodyHeading } from './ArticleBodyHeading';
import { renderWithProvider } from '@/test-utils/render';
import { ARTICLE_BODY_HEADING_IMPORTANCE_LEVELS } from '../ArticleBodyHeading.types';

describe('ArticleBodyHeading', () => {
  it('renders with importance 1 (h1)', () => {
    const { getByRole } = renderWithProvider(
      <ArticleBodyHeading importance={1}>Heading text</ArticleBodyHeading>
    );

    const heading = getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Heading text');
    expect(heading).toHaveClass('typography-article-body-h1');
  });

  it.each(ARTICLE_BODY_HEADING_IMPORTANCE_LEVELS)(
    'renders correct element and class for importance %s',
    (importance) => {
      const { getByRole } = renderWithProvider(
        <ArticleBodyHeading importance={importance}>Level {importance}</ArticleBodyHeading>
      );

      const heading = getByRole('heading', { level: importance });

      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass(`typography-article-body-h${importance}`);
    }
  );

  it('applies custom className', () => {
    const { getByRole } = renderWithProvider(
      <ArticleBodyHeading importance={1} className="custom-class">
        With custom class
      </ArticleBodyHeading>
    );

    const heading = getByRole('heading', { level: 1 });

    expect(heading).toHaveClass('typography-article-body-h1');
    expect(heading).toHaveClass('custom-class');
  });

  it('passes through id and aria-label', () => {
    const { getByRole } = renderWithProvider(
      <ArticleBodyHeading importance={1} id="section-title" aria-label="Section title">
        Title
      </ArticleBodyHeading>
    );

    const heading = getByRole('heading', { level: 1 });

    expect(heading).toHaveAttribute('id', 'section-title');
    expect(heading).toHaveAttribute('aria-label', 'Section title');
  });
});
