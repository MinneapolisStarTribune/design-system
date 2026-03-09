import { render, screen } from '@testing-library/react-native';
import { nativeTokenFixtures } from '@/test-utils/nativeTokenFixtures';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { SponsoredHeading } from './SponsoredHeading.native';
import { SPONSORED_HEADING_IMPORTANCE_LEVELS } from '../SponsoredHeading.types';

describe('SponsoredHeading (native)', () => {
  it('renders with importance 1', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<SponsoredHeading importance={1}>Heading content</SponsoredHeading>, { wrapper });
    expect(screen.getByText('Heading content')).toBeOnTheScreen();
  });

  it.each(SPONSORED_HEADING_IMPORTANCE_LEVELS)('renders importance %s', (importance) => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<SponsoredHeading importance={importance}>Heading - {importance}</SponsoredHeading>, {
      wrapper,
    });
    expect(screen.getByText(`Heading - ${importance}`)).toBeOnTheScreen();
  });

  it('uses Star Tribune sponsored heading tokens when available', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<SponsoredHeading importance={1}>Sponsored</SponsoredHeading>, { wrapper });

    const element = screen.getByText('Sponsored');
    expect(element.props.style).toEqual(
      expect.objectContaining(
        nativeTokenFixtures.startribune.light.typography.typographyEditorialSponsoredH1
      )
    );
  });

  it('renders without throwing on varsity (supported for both)', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'varsity' });
    expect(() =>
      render(<SponsoredHeading importance={1}>Sponsored</SponsoredHeading>, { wrapper })
    ).not.toThrow();
  });
});
