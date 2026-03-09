import { render, screen } from '@testing-library/react-native';
import { nativeTokenFixtures } from '@/test-utils/nativeTokenFixtures';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { EditorialSponsoredText } from './EditorialSponsoredText.native';
import {
  EDITORIAL_SPONSORED_TEXT_SIZES,
  EDITORIAL_SPONSORED_TEXT_WEIGHTS,
} from '../EditorialSponsoredText.types';

describe('EditorialSponsoredText (native)', () => {
  it('renders with required props', () => {
    const wrapper = TestWrapperInDesignSystemProvider();
    render(
      <EditorialSponsoredText size="medium" weight="bold">
        Editorial sponsored content
      </EditorialSponsoredText>,
      { wrapper }
    );

    expect(screen.getByText('Editorial sponsored content')).toBeOnTheScreen();
  });

  it.each(EDITORIAL_SPONSORED_TEXT_SIZES)('renders %s size', (size) => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(
      <EditorialSponsoredText size={size}>Editorial sponsored content</EditorialSponsoredText>,
      {
        wrapper,
      }
    );

    expect(screen.getByText('Editorial sponsored content')).toBeOnTheScreen();
  });

  it.each(EDITORIAL_SPONSORED_TEXT_WEIGHTS)('renders %s weight', (weight) => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(
      <EditorialSponsoredText size="medium" weight={weight}>
        Editorial sponsored content
      </EditorialSponsoredText>,
      { wrapper }
    );

    expect(screen.getByText('Editorial sponsored content')).toBeOnTheScreen();
  });

  it('uses editorial sponsored text typography tokens', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(
      <EditorialSponsoredText size="medium" weight="regular">
        Editorial sponsored content
      </EditorialSponsoredText>,
      { wrapper }
    );

    const element = screen.getByText('Editorial sponsored content');
    expect(element.props.style).toEqual(
      expect.objectContaining(
        nativeTokenFixtures.startribune.light.typography
          .typographyEditorialTextSponsoredRegularMedium
      )
    );
  });
});
