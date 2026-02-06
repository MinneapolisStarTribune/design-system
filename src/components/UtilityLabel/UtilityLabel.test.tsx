import { UtilityLabel } from './UtilityLabel';
import { renderWithProvider } from '../../test-utils/render';

describe('UtilityLabel', () => {
  it('renders with required props', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityLabel size="medium" data-testid="label">
        Test Label
      </UtilityLabel>
    );

    expect(getByTestId('label')).toBeInTheDocument();
    expect(getByTestId('label')).toHaveTextContent('Test Label');
  });

  it('applies correct class for small size with regular weight', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityLabel size="small" weight="regular" data-testid="label">
        Small Label
      </UtilityLabel>
    );

    expect(getByTestId('label')).toHaveClass('typography-utility-label-small');
  });

  it('applies correct class for medium size with semibold weight', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityLabel size="medium" weight="semibold" data-testid="label">
        Medium Bold Label
      </UtilityLabel>
    );

    expect(getByTestId('label')).toHaveClass('typography-utility-label-semibold-medium');
  });

  it('applies correct class for large size', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityLabel size="large" data-testid="label">
        Large Label
      </UtilityLabel>
    );

    expect(getByTestId('label')).toHaveClass('typography-utility-label-large');
  });

  it('defaults to regular weight when weight prop is not provided', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityLabel size="medium" data-testid="label">
        Default Weight
      </UtilityLabel>
    );

    expect(getByTestId('label')).toHaveClass('typography-utility-label-medium');
  });

  it('applies caps class when capitalize is true', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityLabel size="small" weight="regular" capitalize data-testid="label">
        Capitalized Label
      </UtilityLabel>
    );

    expect(getByTestId('label')).toHaveClass('typography-utility-label-small-caps');
  });

  it('does not apply caps class when capitalize is false', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityLabel size="small" weight="semibold" capitalize={false} data-testid="label">
        Normal Label
      </UtilityLabel>
    );

    expect(getByTestId('label')).toHaveClass('typography-utility-label-semibold-small');
    expect(getByTestId('label')).not.toHaveClass('typography-utility-label-semibold-small-caps');
  });

  it('applies custom className', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityLabel size="medium" className="custom-class" data-testid="label">
        Custom Class
      </UtilityLabel>
    );

    expect(getByTestId('label')).toHaveClass('custom-class');
    expect(getByTestId('label')).toHaveClass('typography-utility-label-medium');
  });

  it('renders children correctly', () => {
    const { getByTestId } = renderWithProvider(
      <UtilityLabel size="medium" data-testid="label">
        <span>Nested Content</span>
      </UtilityLabel>
    );

    expect(getByTestId('label').querySelector('span')).toHaveTextContent('Nested Content');
  });
});
