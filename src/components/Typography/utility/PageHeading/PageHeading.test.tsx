import { PageHeading } from './PageHeading';
import { renderWithProvider } from '@/test-utils/render';

describe('PageHeading', () => {
  it('renders with required props', () => {
    const { getByTestId } = renderWithProvider(
      <PageHeading importance={1} dataTestId="heading">
        Page Title
      </PageHeading>
    );

    expect(getByTestId('heading')).toBeInTheDocument();
    expect(getByTestId('heading')).toHaveTextContent('Page Title');
  });

  it('renders correct heading element for importance level', () => {
    const { getByTestId } = renderWithProvider(
      <PageHeading importance={1} dataTestId="h1-heading">
        H1 Heading
      </PageHeading>
    );

    expect(getByTestId('h1-heading').tagName).toBe('H1');
  });

  it('renders h2 when importance is 2', () => {
    const { getByTestId } = renderWithProvider(
      <PageHeading importance={2} dataTestId="h2-heading">
        Section Title
      </PageHeading>
    );

    expect(getByTestId('h2-heading').tagName).toBe('H2');
  });

  it('applies correct class for page heading with h1', () => {
    const { getByTestId } = renderWithProvider(
      <PageHeading importance={1} dataTestId="heading">
        Page H1
      </PageHeading>
    );

    expect(getByTestId('heading')).toHaveClass('typography-utility-page-h1');
  });

  it('applies correct class for page heading with h2', () => {
    const { getByTestId } = renderWithProvider(
      <PageHeading importance={2} dataTestId="heading">
        Page H2
      </PageHeading>
    );

    expect(getByTestId('heading')).toHaveClass('typography-utility-page-h2');
  });

  it('applies custom className', () => {
    const { getByTestId } = renderWithProvider(
      <PageHeading importance={1} className="custom-heading-class" dataTestId="heading">
        Custom Class Heading
      </PageHeading>
    );

    expect(getByTestId('heading')).toHaveClass('custom-heading-class');
    expect(getByTestId('heading')).toHaveClass('typography-utility-page-h1');
  });

  it('renders children correctly', () => {
    const { getByTestId } = renderWithProvider(
      <PageHeading importance={1} dataTestId="heading">
        <span>Nested Content</span>
      </PageHeading>
    );

    expect(getByTestId('heading').querySelector('span')).toHaveTextContent('Nested Content');
  });
});
