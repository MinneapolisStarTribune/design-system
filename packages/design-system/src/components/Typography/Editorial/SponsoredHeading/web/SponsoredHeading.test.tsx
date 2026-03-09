import { renderWithProvider } from '@/test-utils/render';
import { SponsoredHeading } from './SponsoredHeading';
import { SPONSORED_HEADING_IMPORTANCE_LEVELS } from '../SponsoredHeading.types';

describe('SponsoredHeading', () => {
  it('renders with importance 1 (h1)', () => {
    const { getByRole } = renderWithProvider(
      <SponsoredHeading importance={1}>Heading text</SponsoredHeading>
    );

    const heading = getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Heading text');
    expect(heading).toHaveClass('typography-sponsored-h1');
  });

  it.each(SPONSORED_HEADING_IMPORTANCE_LEVELS)(
    'renders correct element and class for importance %s',
    (importance) => {
      const { getByRole } = renderWithProvider(
        <SponsoredHeading importance={importance}>Level {importance}</SponsoredHeading>
      );

      const heading = getByRole('heading', { level: importance });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass(`typography-sponsored-h${importance}`);
    }
  );

  it('applies custom className', () => {
    const { getByRole } = renderWithProvider(
      <SponsoredHeading importance={1} className="custom-class">
        With custom class
      </SponsoredHeading>
    );

    const heading = getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('typography-sponsored-h1');
    expect(heading).toHaveClass('custom-class');
  });

  it('passes through id and aria-label', () => {
    const { getByRole } = renderWithProvider(
      <SponsoredHeading importance={1} id="section-title" aria-label="Section title">
        Title
      </SponsoredHeading>
    );

    const heading = getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('id', 'section-title');
    expect(heading).toHaveAttribute('aria-label', 'Section title');
  });

  it('renders without throwing when brand is startribune', () => {
    expect(() =>
      renderWithProvider(<SponsoredHeading importance={1}>Sponsored</SponsoredHeading>, {
        brand: 'startribune',
      })
    ).not.toThrow();
  });

  it('renders without throwing when brand is varsity (Sponsored supported for both)', () => {
    expect(() =>
      renderWithProvider(<SponsoredHeading importance={1}>Sponsored</SponsoredHeading>, {
        brand: 'varsity',
      })
    ).not.toThrow();
  });
});
