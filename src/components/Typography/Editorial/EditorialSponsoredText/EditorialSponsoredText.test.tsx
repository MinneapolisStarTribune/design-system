import { EditorialSponsoredText } from './EditorialSponsoredText';
import { renderWithProvider } from '@/test-utils/render';

describe('EditorialSponsoredText', () => {
  it('renders with required props', () => {
    const { getByTestId } = renderWithProvider(
      <EditorialSponsoredText size="medium" weight={'bold'} data-testid="editorial-text-sponsored">
        Editorial sponsored content
      </EditorialSponsoredText>
    );

    const element = getByTestId('editorial-text-sponsored');

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('typography-editorial-text-sponsored-bold-medium');
    expect(element).toHaveTextContent('Editorial sponsored content');
  });

  it('applies correct class for medium size', () => {
    const { getByTestId } = renderWithProvider(
      <EditorialSponsoredText size="medium" weight="regular" data-testid="editorial-text-sponsored">
        Editorial sponsored content
      </EditorialSponsoredText>
    );

    const element = getByTestId('editorial-text-sponsored');

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('typography-editorial-text-sponsored-regular-medium');
  });

  it('applies correct class for small size', () => {
    const { getByTestId } = renderWithProvider(
      <EditorialSponsoredText size="small" weight="regular" data-testid="editorial-text-sponsored">
        Editorial sponsored content
      </EditorialSponsoredText>
    );

    const element = getByTestId('editorial-text-sponsored');

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('typography-editorial-text-sponsored-regular-small');
  });

  it('applies correct class for large size', () => {
    const { getByTestId } = renderWithProvider(
      <EditorialSponsoredText size="large" weight="regular" data-testid="editorial-text-sponsored">
        Editorial sponsored content
      </EditorialSponsoredText>
    );

    const element = getByTestId('editorial-text-sponsored');

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('typography-editorial-text-sponsored-regular-large');
  });

  it('applies custom className when provided', () => {
    const { getByTestId } = renderWithProvider(
      <EditorialSponsoredText
        size="medium"
        weight="bold"
        className="custom-class"
        data-testid="editorial-text-sponsored"
      >
        Editorial sponsored content
      </EditorialSponsoredText>
    );

    const element = getByTestId('editorial-text-sponsored');

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('typography-editorial-text-sponsored-bold-medium');
    expect(element).toHaveClass('custom-class');
  });

  it('renders children correctly', () => {
    const { getByTestId } = renderWithProvider(
      <EditorialSponsoredText size="small" weight="regular" data-testid="editorial-text-sponsored">
        <span>Sample editorial text</span>
      </EditorialSponsoredText>
    );

    const element = getByTestId('editorial-text-sponsored');

    expect(element).toBeInTheDocument();
    expect(element.querySelector('span')).toHaveTextContent('Sample editorial text');
  });

  it('defaults to regular weight when weight prop is not provided', () => {
    const { getByTestId } = renderWithProvider(
      <EditorialSponsoredText size="medium" data-testid="editorial-text-sponsored">
        Editorial sponsored content
      </EditorialSponsoredText>
    );

    const element = getByTestId('editorial-text-sponsored');

    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('typography-editorial-text-sponsored-regular-medium');
  });
});
