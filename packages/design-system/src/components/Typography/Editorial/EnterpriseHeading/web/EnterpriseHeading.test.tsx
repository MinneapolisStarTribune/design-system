import { renderWithProvider } from '@/test-utils/render';
import { EnterpriseHeading } from './EnterpriseHeading';
import { ENTERPRISE_HEADING_IMPORTANCE_LEVELS } from '../EnterpriseHeading.types';

describe('EnterpriseHeading', () => {
  it('renders with default importance (h1)', () => {
    const { getByRole } = renderWithProvider(
      <EnterpriseHeading importance={1}>Heading text</EnterpriseHeading>
    );
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Heading text');
    expect(heading).toHaveClass('typography-editorial-enterprise-h1');
  });

  it.each(ENTERPRISE_HEADING_IMPORTANCE_LEVELS)(
    'renders correct element and class for importance %s',
    (importance) => {
      const { getByRole } = renderWithProvider(
        <EnterpriseHeading importance={importance}>Level {importance}</EnterpriseHeading>
      );
      const heading = getByRole('heading', { level: importance });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass(`typography-editorial-enterprise-h${importance}`);
    }
  );

  it('applies custom className', () => {
    const { getByRole } = renderWithProvider(
      <EnterpriseHeading importance={1} className="custom-class">
        With custom class
      </EnterpriseHeading>
    );
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('typography-editorial-enterprise-h1');
    expect(heading).toHaveClass('custom-class');
  });

  it('passes through id and aria-label', () => {
    const { getByRole } = renderWithProvider(
      <EnterpriseHeading importance={1} id="section-title" aria-label="Section title">
        Title
      </EnterpriseHeading>
    );
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('id', 'section-title');
    expect(heading).toHaveAttribute('aria-label', 'Section title');
  });

  it('renders without throwing when brand is startribune', () => {
    expect(() =>
      renderWithProvider(<EnterpriseHeading importance={1}>Enterprise</EnterpriseHeading>, {
        brand: 'startribune',
      })
    ).not.toThrow();
  });

  it('throws when brand is varsity (Enterprise is Star Tribune only)', () => {
    expect(() =>
      renderWithProvider(<EnterpriseHeading importance={1}>Enterprise</EnterpriseHeading>, {
        brand: 'varsity',
      })
    ).toThrow();
  });
});
