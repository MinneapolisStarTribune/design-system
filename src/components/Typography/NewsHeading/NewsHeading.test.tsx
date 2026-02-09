import { describe, it, expect } from 'vitest';
import { NewsHeading } from './NewsHeading';
import { NonNewsHeading } from '../NonNewsHeading/NonNewsHeading';
import { renderWithProvider } from '../../../test-utils/render';

describe('NewsHeading', () => {
  it('renders with default importance (h1)', () => {
    const { getByRole } = renderWithProvider(
      <NewsHeading importance={1}>Heading text</NewsHeading>
    );
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Heading text');
    expect(heading).toHaveClass('typography-editorial-news-h1');
  });

  it('renders correct element and class for each importance level', () => {
    const levels = [1, 2, 3, 4, 5, 6] as const;
    levels.forEach((importance) => {
      const { getByRole, unmount } = renderWithProvider(
        <NewsHeading importance={importance}>Level {importance}</NewsHeading>
      );
      const heading = getByRole('heading', { level: importance });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass(`typography-editorial-news-h${importance}`);
      unmount();
    });
  });

  it('applies custom className', () => {
    const { getByRole } = renderWithProvider(
      <NewsHeading importance={1} className="custom-class">
        With custom class
      </NewsHeading>
    );
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('typography-editorial-news-h1');
    expect(heading).toHaveClass('custom-class');
  });

  it('passes through id and aria-label', () => {
    const { getByRole } = renderWithProvider(
      <NewsHeading importance={1} id="section-title" aria-label="Section title">
        Title
      </NewsHeading>
    );
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('id', 'section-title');
    expect(heading).toHaveAttribute('aria-label', 'Section title');
  });

  it('renders without throwing when brand is startribune', () => {
    expect(() =>
      renderWithProvider(<NewsHeading importance={1}>News</NewsHeading>, { brand: 'startribune' })
    ).not.toThrow();
  });

  it('renders without throwing when brand is varsity (News supported for both)', () => {
    expect(() =>
      renderWithProvider(<NewsHeading importance={1}>News</NewsHeading>, { brand: 'varsity' })
    ).not.toThrow();
  });
});

describe('Editorial heading brand validation', () => {
  it('throws when rendering Varsity-unsupported heading (NonNewsHeading) with brand varsity', () => {
    expect(() =>
      renderWithProvider(<NonNewsHeading importance={1}>Non-news</NonNewsHeading>, {
        brand: 'varsity',
      })
    ).toThrow(/NonNewsHeading.*not supported.*varsity/);
  });
});
