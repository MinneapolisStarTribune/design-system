import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { DangerousCodeBlock } from './DangerousCodeBlock.native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { cleanMarkup } from '../DangerousCodeBlock.utils';

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

describe('DangerousCodeBlock (native)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<DangerousCodeBlock markup="<div>Test</div>" />, { wrapper });

    expect(screen.getByTestId('dangerous-code-block')).toBeOnTheScreen();
  });

  it('uses the default dataTestId when dataTestId is not provided', () => {
    render(<DangerousCodeBlock markup="<p>Default</p>" />, { wrapper });

    expect(screen.getByTestId('dangerous-code-block')).toBeOnTheScreen();
  });

  it('applies a custom dataTestId to the root element', () => {
    render(<DangerousCodeBlock markup="<p>Custom</p>" dataTestId="my-code-block" />, { wrapper });

    expect(screen.getByTestId('my-code-block')).toBeOnTheScreen();
  });

  it('renders the standard variant without crashing', () => {
    render(<DangerousCodeBlock markup="<div>Standard</div>" variant="standard" />, { wrapper });

    expect(screen.getByTestId('dangerous-code-block')).toBeOnTheScreen();
  });

  it('renders the immersive variant without crashing', () => {
    render(<DangerousCodeBlock markup="<div>Immersive</div>" variant="immersive" />, { wrapper });

    expect(screen.getByTestId('dangerous-code-block')).toBeOnTheScreen();
  });

  it('calls cleanMarkup with markup and cleanQuotes=true by default', () => {
    render(<DangerousCodeBlock markup="<div>Content</div>" />, { wrapper });

    expect(cleanMarkup).toHaveBeenCalledWith('<div>Content</div>', true);
  });

  it('calls cleanMarkup with cleanQuotes=false when the prop is set', () => {
    render(<DangerousCodeBlock markup="<div>Content</div>" cleanQuotes={false} />, { wrapper });

    expect(cleanMarkup).toHaveBeenCalledWith('<div>Content</div>', false);
  });

  it('renders without crashing when a custom style prop is provided', () => {
    render(<DangerousCodeBlock markup="<div>Styled</div>" style={{ margin: 8 }} />, { wrapper });

    expect(screen.getByTestId('dangerous-code-block')).toBeOnTheScreen();
  });
});
