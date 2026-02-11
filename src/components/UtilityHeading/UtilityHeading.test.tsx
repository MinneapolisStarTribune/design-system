import { UtilityHeading } from './UtilityHeading';
import { renderWithProvider } from '../../test-utils/render';

describe('UtilityHeading', () => {
  it('renders with required props', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityHeading importance={1} headingType="page" dataTestId="heading">
        Page Title
      </UtilityHeading>
    );

    expect(getByTestId('heading')).toBeInTheDocument();
    expect(getByTestId('heading')).toHaveTextContent('Page Title');
  });

  it('renders correct heading element for importance level', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityHeading importance={1} headingType="page" dataTestId="h1-heading">
        H1 Heading
      </UtilityHeading>
    );

    expect(getByTestId('h1-heading').tagName).toBe('H1');
  });

  it('renders h2 when importance is 2', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityHeading importance={2} headingType="section" dataTestId="h2-heading">
        Section Title
      </UtilityHeading>
    );

    expect(getByTestId('h2-heading').tagName).toBe('H2');
  });

  it('applies correct class for section heading with h1', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityHeading importance={1} headingType="section" dataTestId="heading">
        Section H1
      </UtilityHeading>
    );

    expect(getByTestId('heading')).toHaveClass('typography-utility-section-h1');
  });

  it('applies correct class for section heading with h2', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityHeading importance={2} headingType="section" dataTestId="heading">
        Section H2
      </UtilityHeading>
    );

    expect(getByTestId('heading')).toHaveClass('typography-utility-section-h2');
  });

  it('applies correct class for page heading with h1', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityHeading importance={1} headingType="page" dataTestId="heading">
        Page H1
      </UtilityHeading>
    );

    expect(getByTestId('heading')).toHaveClass('typography-utility-page-h1');
  });

  it('applies correct class for page heading with h2', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityHeading importance={2} headingType="page" dataTestId="heading">
        Page H2
      </UtilityHeading>
    );

    expect(getByTestId('heading')).toHaveClass('typography-utility-page-h2');
  });

  it('applies custom className', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityHeading
        importance={1}
        headingType="page"
        className="custom-heading-class"
        dataTestId="heading"
      >
        Custom Class Heading
      </UtilityHeading>
    );

    expect(getByTestId('heading')).toHaveClass('custom-heading-class');
    expect(getByTestId('heading')).toHaveClass('typography-utility-page-h1');
  });

  it('renders children correctly', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityHeading importance={1} headingType="page" dataTestId="heading">
        <span>Nested Content</span>
      </UtilityHeading>
    );

    expect(getByTestId('heading').querySelector('span')).toHaveTextContent('Nested Content');
  });
});
