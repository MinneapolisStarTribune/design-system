import { renderWithProvider } from '@/test-utils/render';
import { NonNewsHeading } from './NonNewsHeading';
import { NON_NEWS_HEADING_IMPORTANCE_LEVELS } from '../NonNewsHeading.types';

describe('NonNewsHeading', () => {
  it('renders with default importance (h1)', () => {
    const { getByRole } = renderWithProvider(
      <NonNewsHeading importance={1}>Heading text</NonNewsHeading>
    );
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Heading text');
    expect(heading).toHaveClass('typography-editorial-non-news-h1');
  });

  it.each(NON_NEWS_HEADING_IMPORTANCE_LEVELS)(
    'renders correct element and class for importance %s',
    (importance) => {
      const { getByRole } = renderWithProvider(
        <NonNewsHeading importance={importance}>Level {importance}</NonNewsHeading>
      );
      const heading = getByRole('heading', { level: importance });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass(`typography-editorial-non-news-h${importance}`);
    }
  );

  it('applies custom className', () => {
    const { getByRole } = renderWithProvider(
      <NonNewsHeading importance={1} className="custom-class">
        With custom class
      </NonNewsHeading>
    );
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('typography-editorial-non-news-h1');
    expect(heading).toHaveClass('custom-class');
  });

  it('passes through id and aria-label', () => {
    const { getByRole } = renderWithProvider(
      <NonNewsHeading importance={1} id="section-title" aria-label="Section title">
        Title
      </NonNewsHeading>
    );
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('id', 'section-title');
    expect(heading).toHaveAttribute('aria-label', 'Section title');
  });

  it('renders without throwing when brand is startribune', () => {
    expect(() =>
      renderWithProvider(<NonNewsHeading importance={1}>Non-news</NonNewsHeading>, {
        brand: 'startribune',
      })
    ).not.toThrow();
  });

  it('throws when brand is varsity', () => {
    expect(() =>
      renderWithProvider(<NonNewsHeading importance={1}>Non-news</NonNewsHeading>, {
        brand: 'varsity',
      })
    ).toThrow();
  });
});
