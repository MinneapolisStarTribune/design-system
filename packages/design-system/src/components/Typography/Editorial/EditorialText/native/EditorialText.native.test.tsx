import { render, screen } from '@testing-library/react-native';
import { nativeTokenFixtures } from '@/test-utils/nativeTokenFixtures';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { EditorialText } from './EditorialText.native';
import { EDITORIAL_TEXT_SIZES, EDITORIAL_TEXT_WEIGHTS } from '../EditorialText.types';

describe('EditorialText (native)', () => {
  it('renders with required props', () => {
    const wrapper = TestWrapperInDesignSystemProvider();
    render(
      <EditorialText size="medium" weight="bold">
        Editorial content
      </EditorialText>,
      { wrapper }
    );

    expect(screen.getByText('Editorial content')).toBeOnTheScreen();
  });

  it.each(EDITORIAL_TEXT_SIZES)('renders %s size', (size) => {
    const wrapper = TestWrapperInDesignSystemProvider();
    render(<EditorialText size={size}>Editorial content</EditorialText>, { wrapper });
    expect(screen.getByText('Editorial content')).toBeOnTheScreen();
  });

  it.each(EDITORIAL_TEXT_WEIGHTS)('renders %s weight', (weight) => {
    const wrapper = TestWrapperInDesignSystemProvider();
    render(
      <EditorialText size="medium" weight={weight}>
        Editorial content
      </EditorialText>,
      { wrapper }
    );
    expect(screen.getByText('Editorial content')).toBeOnTheScreen();
  });

  it('uses editorial text typography tokens', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(
      <EditorialText size="medium" weight="regular">
        Editorial content
      </EditorialText>,
      { wrapper }
    );

    const element = screen.getByText('Editorial content');
    expect(element.props.style).toEqual(
      expect.objectContaining(
        nativeTokenFixtures.startribune.light.typography.typographyEditorialTextRegularMedium
      )
    );
  });
});
