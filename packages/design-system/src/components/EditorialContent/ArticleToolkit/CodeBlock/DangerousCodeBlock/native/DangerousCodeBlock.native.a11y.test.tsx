import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { DangerousCodeBlock } from './DangerousCodeBlock.native';

jest.mock('react-native-webview', () => ({
  WebView: () => null,
}));

jest.mock('@/hooks/useNativeStyles', () => ({
  useNativeStyles: () => ({
    styles: {
      base: {},
      variantStandard: { backgroundColor: 'white' },
      variantImmersive: { backgroundColor: 'black' },
    },
  }),
}));

jest.mock('../DangerousCodeBlock.utils', () => ({
  cleanMarkup: jest.fn((m: string) => m),
}));

const wrapper = TestWrapperInDesignSystemProvider();

describe('DangerousCodeBlock Accessibility (native)', () => {
  it('root element is present in the accessibility tree', () => {
    render(<DangerousCodeBlock markup="<div>Content</div>" />, { wrapper });

    expect(screen.getByTestId('dangerous-code-block')).toBeOnTheScreen();
  });

  it('root element does not expose an accessible role that would misrepresent its purpose', () => {
    render(<DangerousCodeBlock markup="<div>Content</div>" />, { wrapper });

    const root = screen.getByTestId('dangerous-code-block');

    expect(root.props.accessibilityRole).toBeUndefined();
  });

  it('does not expose an accessibility label on the root container', () => {
    render(<DangerousCodeBlock markup="<div>Content</div>" />, { wrapper });

    const root = screen.getByTestId('dangerous-code-block');

    expect(root.props.accessibilityLabel).toBeUndefined();
  });

  it('uses the custom dataTestId for identification', () => {
    render(<DangerousCodeBlock markup="<div>Content</div>" dataTestId="custom-block" />, {
      wrapper,
    });

    expect(screen.getByTestId('custom-block')).toBeOnTheScreen();
  });

  it('renders the standard variant and is present in the accessibility tree', () => {
    render(<DangerousCodeBlock markup="<div>Standard</div>" variant="standard" />, { wrapper });

    expect(screen.getByTestId('dangerous-code-block')).toBeOnTheScreen();
  });

  it('renders the immersive variant and is present in the accessibility tree', () => {
    render(<DangerousCodeBlock markup="<div>Immersive</div>" variant="immersive" />, { wrapper });

    expect(screen.getByTestId('dangerous-code-block')).toBeOnTheScreen();
  });
});
