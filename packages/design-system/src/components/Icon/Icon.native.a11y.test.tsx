import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { createNativeIconWrapper, NATIVE_ICON_PIXEL_SIZES } from './Icon.native';

const ds = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

// Minimal valid SVG for testing
const testSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentcolor" width="16" height="16"><path d="M8 0a8 8 0 110 16A8 8 0 018 0z"/></svg>';

const TestIcon = createNativeIconWrapper(testSvg, 'TestIcon');

describe('Icon Accessibility (native)', () => {
  it('renders with default size and color', () => {
    render(<TestIcon testID="icon" />, { wrapper: ds });

    expect(screen.getByTestId('icon')).toBeOnTheScreen();
  });

  it('passes testID for automated testing', () => {
    render(<TestIcon testID="search-icon" />, { wrapper: ds });

    expect(screen.getByTestId('search-icon')).toBeOnTheScreen();
  });

  it('renders at each supported size', () => {
    const sizes = Object.keys(NATIVE_ICON_PIXEL_SIZES) as Array<
      keyof typeof NATIVE_ICON_PIXEL_SIZES
    >;

    for (const size of sizes) {
      const { unmount } = render(<TestIcon testID="icon" size={size} />, { wrapper: ds });
      expect(screen.getByTestId('icon')).toBeOnTheScreen();
      unmount();
    }
  });

  it('renders with different semantic colors without crashing', () => {
    const colors = [
      'brand-01',
      'on-light-primary',
      'on-dark-primary',
      'state-attention-on-light',
      'state-disabled-on-light',
    ] as const;

    for (const color of colors) {
      const { unmount } = render(<TestIcon testID="icon" color={color} />, { wrapper: ds });
      expect(screen.getByTestId('icon')).toBeOnTheScreen();
      unmount();
    }
  });

  it('sets displayName on the created component', () => {
    expect(TestIcon.displayName).toBe('TestIcon');
  });

  it('defaults displayName to NativeIcon when not provided', () => {
    const AnonymousIcon = createNativeIconWrapper(testSvg);
    expect(AnonymousIcon.displayName).toBe('NativeIcon');
  });
});
