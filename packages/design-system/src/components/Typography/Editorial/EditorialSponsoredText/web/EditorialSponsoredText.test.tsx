import { renderWithProvider } from '@/test-utils/render';
import { EditorialSponsoredText } from './EditorialSponsoredText';
import {
  EDITORIAL_SPONSORED_TEXT_SIZES,
  EDITORIAL_SPONSORED_TEXT_WEIGHTS,
} from '../EditorialSponsoredText.types';

describe('EditorialSponsoredText', () => {
  it('renders with required props', () => {
    const { getByTestId } = renderWithProvider(
      <EditorialSponsoredText size="medium" weight="bold" dataTestId="editorial-text-sponsored">
        Editorial sponsored content
      </EditorialSponsoredText>
    );

    const element = getByTestId('editorial-text-sponsored');
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('typography-editorial-text-sponsored-bold-medium');
    expect(element).toHaveTextContent('Editorial sponsored content');
  });

  it.each(EDITORIAL_SPONSORED_TEXT_SIZES)('applies correct class for %s size', (size) => {
    const { getByTestId } = renderWithProvider(
      <EditorialSponsoredText size={size} weight="regular" dataTestId="editorial-text-sponsored">
        Editorial sponsored content
      </EditorialSponsoredText>
    );

    const element = getByTestId('editorial-text-sponsored');
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass(`typography-editorial-text-sponsored-regular-${size}`);
  });

  it.each(EDITORIAL_SPONSORED_TEXT_WEIGHTS)('applies correct class for %s weight', (weight) => {
    const { getByTestId } = renderWithProvider(
      <EditorialSponsoredText size="medium" weight={weight} dataTestId="editorial-text-sponsored">
        Editorial sponsored content
      </EditorialSponsoredText>
    );

    const element = getByTestId('editorial-text-sponsored');
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass(`typography-editorial-text-sponsored-${weight}-medium`);
  });

  it('defaults to regular weight when weight prop is not provided', () => {
    const { getByTestId } = renderWithProvider(
      <EditorialSponsoredText size="medium" dataTestId="editorial-text-sponsored">
        Editorial sponsored content
      </EditorialSponsoredText>
    );

    expect(getByTestId('editorial-text-sponsored')).toHaveClass(
      'typography-editorial-text-sponsored-regular-medium'
    );
  });
});
