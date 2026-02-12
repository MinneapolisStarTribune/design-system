import { EditorialText } from './EditorialText';
import { renderWithProvider } from '@/test-utils/render';

describe('EditorialText', () => {
  it('renders with required props', () => {
    const { getByTestId } = renderWithProvider(
      <EditorialText size="medium" weight={'bold'} data-testid="editorial-text">
        Editorial content
      </EditorialText>
    );

    const element = getByTestId('editorial-text');

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('typography-editorial-text-bold-medium');
    expect(element).toHaveTextContent('Editorial content');
  });

  it('applies correct class for medium size', () => {
    const { getByTestId } = renderWithProvider(
      <EditorialText size="medium" weight="regular" data-testid="editorial-text">
        Editorial content
      </EditorialText>
    );

    const element = getByTestId('editorial-text');

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('typography-editorial-text-regular-medium');
  });

  it('applies correct class for small size', () => {
    const { getByTestId } = renderWithProvider(
      <EditorialText size="small" weight="regular" data-testid="editorial-text">
        Editorial content
      </EditorialText>
    );

    const element = getByTestId('editorial-text');

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('typography-editorial-text-regular-small');
  });

  it('applies correct class for large size', () => {
    const { getByTestId } = renderWithProvider(
      <EditorialText size="large" weight="regular" data-testid="editorial-text">
        Editorial content
      </EditorialText>
    );

    const element = getByTestId('editorial-text');

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('typography-editorial-text-regular-large');
  });

  it('applies custom className when provided', () => {
    const { getByTestId } = renderWithProvider(
      <EditorialText
        size="medium"
        weight="bold"
        className="custom-class"
        data-testid="editorial-text"
      >
        Editorial content
      </EditorialText>
    );

    const element = getByTestId('editorial-text');

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('typography-editorial-text-bold-medium');
    expect(element).toHaveClass('custom-class');
  });

  it('renders children correctly', () => {
    const { getByTestId } = renderWithProvider(
      <EditorialText size="small" weight="regular" data-testid="editorial-text">
        <span>Sample editorial text</span>
      </EditorialText>
    );

    const element = getByTestId('editorial-text');

    expect(element).toBeInTheDocument();
    expect(element.querySelector('span')).toHaveTextContent('Sample editorial text');
  });

  it('defaults to regular weight when weight prop is not provided', () => {
    const { getByTestId } = renderWithProvider(
      <EditorialText size="medium" data-testid="editorial-text">
        Editorial content
      </EditorialText>
    );

    const element = getByTestId('editorial-text');

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('typography-editorial-text-regular-medium');
  });
});
