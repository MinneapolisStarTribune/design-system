import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { SponsoredHeading } from './SponsoredHeading.native';

describe('SponsoredHeading Accessibility (native)', () => {
  it('sets accessibilityRole to "header" by default', () => {
    const wrapper = TestWrapperInDesignSystemProvider();
    render(<SponsoredHeading importance={1}>Sponsored Heading</SponsoredHeading>, { wrapper });

    expect(screen.getByRole('header')).toBeOnTheScreen();
  });
});
