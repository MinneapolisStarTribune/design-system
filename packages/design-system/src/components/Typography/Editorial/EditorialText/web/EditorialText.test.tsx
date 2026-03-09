import { renderWithProvider } from '@/test-utils/render';
import { EditorialText } from './EditorialText';
import { EDITORIAL_TEXT_SIZES, EDITORIAL_TEXT_WEIGHTS } from '../EditorialText.types';

describe('EditorialText', () => {
  it('renders with required props', () => {
    const { getByTestId } = renderWithProvider(
      <EditorialText size="medium" weight="bold" dataTestId="editorial-text">
        Editorial content
      </EditorialText>
    );

    const element = getByTestId('editorial-text');
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('typography-editorial-text-bold-medium');
    expect(element).toHaveTextContent('Editorial content');
  });

  it.each(EDITORIAL_TEXT_SIZES)('applies correct class for %s size', (size) => {
    const { getByTestId } = renderWithProvider(
      <EditorialText size={size} weight="regular" dataTestId="editorial-text">
        Editorial content
      </EditorialText>
    );

    expect(getByTestId('editorial-text')).toHaveClass(`typography-editorial-text-regular-${size}`);
  });

  it.each(EDITORIAL_TEXT_WEIGHTS)('applies correct class for %s weight', (weight) => {
    const { getByTestId } = renderWithProvider(
      <EditorialText size="medium" weight={weight} dataTestId="editorial-text">
        Editorial content
      </EditorialText>
    );

    expect(getByTestId('editorial-text')).toHaveClass(`typography-editorial-text-${weight}-medium`);
  });
});
