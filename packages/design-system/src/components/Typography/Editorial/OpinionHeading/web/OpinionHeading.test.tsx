import { renderWithProvider } from '@/test-utils/render';
import { OpinionHeading } from './OpinionHeading';
import { OPINION_HEADING_IMPORTANCE_LEVELS } from '../OpinionHeading.types';

describe('OpinionHeading', () => {
  it('renders with default importance (h1)', () => {
    const { getByRole } = renderWithProvider(
      <OpinionHeading importance={1}>Heading text</OpinionHeading>
    );
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Heading text');
    expect(heading).toHaveClass('typography-editorial-opinion-h1');
  });

  it.each(OPINION_HEADING_IMPORTANCE_LEVELS)(
    'renders correct element and class for importance %s',
    (importance) => {
      const { getByRole } = renderWithProvider(
        <OpinionHeading importance={importance}>Level {importance}</OpinionHeading>
      );
      const heading = getByRole('heading', { level: importance });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass(`typography-editorial-opinion-h${importance}`);
    }
  );

  it('applies custom className', () => {
    const { getByRole } = renderWithProvider(
      <OpinionHeading importance={1} className="custom-class">
        With custom class
      </OpinionHeading>
    );
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('typography-editorial-opinion-h1');
    expect(heading).toHaveClass('custom-class');
  });

  it('passes through id and aria-label', () => {
    const { getByRole } = renderWithProvider(
      <OpinionHeading importance={1} id="section-title" aria-label="Section title">
        Title
      </OpinionHeading>
    );
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('id', 'section-title');
    expect(heading).toHaveAttribute('aria-label', 'Section title');
  });
});
