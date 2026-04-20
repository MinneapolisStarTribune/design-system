import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { View } from 'react-native';
import { CODE_BLOCK_SIZES } from '../../../types';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { EnhancedCodeBlock } from './EnhancedCodeBlock.native';

const mockDangerousCodeBlock = jest.fn((props: Record<string, unknown>) => (
  <View testID={(props.dataTestId as string) ?? 'dangerous-code-block'} />
));

jest.mock('../../DangerousCodeBlock/native/DangerousCodeBlock.native', () => ({
  DangerousCodeBlock: (props: Record<string, unknown>) => mockDangerousCodeBlock(props),
}));

jest.mock('@/hooks/useNativeStyles', () => ({
  useNativeStyles: () => ({
    styles: {
      container: {},
      'variant-standard-size-full': { maxWidth: 390 },
      'variant-standard-size-large': { maxWidth: 390 },
      'variant-standard-size-medium': { maxWidth: 390 },
      'variant-standard-size-inline': { maxWidth: 358 },
      'variant-immersive-size-full': { width: '100%', maxWidth: undefined },
      'variant-immersive-size-large': { maxWidth: 390 },
      'variant-immersive-size-medium': { maxWidth: 390 },
      'variant-immersive-size-inline': { maxWidth: 358 },
    },
  }),
}));

const wrapper = TestWrapperInDesignSystemProvider();

describe('EnhancedCodeBlock Accessibility (native)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the root element in the accessibility tree', () => {
    render(<EnhancedCodeBlock markup="<div>Embed</div>" />, { wrapper });

    expect(screen.getByTestId('enhanced-code-block')).toBeOnTheScreen();
  });

  it('does not set accessibilityRole by default', () => {
    render(<EnhancedCodeBlock markup="<div>Embed</div>" />, { wrapper });

    const props = mockDangerousCodeBlock.mock.calls[0][0] as Record<string, unknown>;
    expect(props.accessibilityRole).toBeUndefined();
  });

  it('does not set accessibilityLabel by default', () => {
    render(<EnhancedCodeBlock markup="<div>Embed</div>" />, { wrapper });

    const props = mockDangerousCodeBlock.mock.calls[0][0] as Record<string, unknown>;
    expect(props.accessibilityLabel).toBeUndefined();
  });

  it('applies custom dataTestId for identification', () => {
    render(<EnhancedCodeBlock markup="<div>Embed</div>" dataTestId="enhanced-custom" />, {
      wrapper,
    });

    expect(screen.getByTestId('enhanced-custom')).toBeOnTheScreen();
  });

  it('forwards default variant and cleanQuotes values', () => {
    render(<EnhancedCodeBlock markup="<div>Embed</div>" />, { wrapper });

    const props = mockDangerousCodeBlock.mock.calls[0][0] as Record<string, unknown>;
    expect(props.variant).toBe('standard');
    expect(props.cleanQuotes).toBe(true);
  });

  it.each(CODE_BLOCK_SIZES)('renders size %s when cleanQuotes is false', (size) => {
    render(<EnhancedCodeBlock markup="<div>Embed</div>" cleanQuotes={false} size={size} />, {
      wrapper,
    });

    expect(screen.getByTestId('enhanced-code-block')).toBeOnTheScreen();
  });

  it('forwards immersive variant without introducing incorrect accessibility semantics', () => {
    render(<EnhancedCodeBlock markup="<div>Embed</div>" variant="immersive" />, { wrapper });

    const props = mockDangerousCodeBlock.mock.calls[0][0] as Record<string, unknown>;
    expect(props.variant).toBe('immersive');
    expect(props.accessibilityRole).toBeUndefined();
    expect(props.accessibilityLabel).toBeUndefined();
  });

  it('applies variant-size style mapping when cleanQuotes is false', () => {
    render(
      <EnhancedCodeBlock
        markup="<div>Embed</div>"
        variant="immersive"
        size="inline"
        cleanQuotes={false}
      />,
      { wrapper }
    );

    const props = mockDangerousCodeBlock.mock.calls[0][0] as Record<string, unknown>;
    expect(props.style).toEqual(expect.objectContaining({ maxWidth: 358 }));
  });
});
