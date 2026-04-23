import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { View, StyleSheet } from 'react-native';
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

describe('EnhancedCodeBlock (native)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getFlattenedStyle = () => {
    const props = mockDangerousCodeBlock.mock.calls[0][0] as Record<string, unknown>;
    return StyleSheet.flatten(props.style);
  };

  it('renders without crashing', () => {
    render(<EnhancedCodeBlock markup="<div>Test</div>" />, { wrapper });

    expect(screen.getByTestId('enhanced-code-block')).toBeOnTheScreen();
  });

  it('applies custom dataTestId to the root element', () => {
    render(<EnhancedCodeBlock markup="<div>Test</div>" dataTestId="enhanced-custom" />, {
      wrapper,
    });

    expect(screen.getByTestId('enhanced-custom')).toBeOnTheScreen();
  });

  it('forwards markup to DangerousCodeBlock', () => {
    render(<EnhancedCodeBlock markup="<div>Forwarded markup</div>" />, { wrapper });

    const props = mockDangerousCodeBlock.mock.calls[0][0] as Record<string, unknown>;
    expect(props.markup).toBe('<div>Forwarded markup</div>');
  });

  it('forwards default props to DangerousCodeBlock', () => {
    render(<EnhancedCodeBlock markup="<div>Defaults</div>" />, { wrapper });

    const props = mockDangerousCodeBlock.mock.calls[0][0] as Record<string, unknown>;
    expect(props.variant).toBe('standard');
    expect(props.cleanQuotes).toBe(true);
    expect(props.dataTestId).toBe('enhanced-code-block');
  });

  it('forwards explicit variant and cleanQuotes props', () => {
    render(
      <EnhancedCodeBlock markup="<div>Explicit</div>" variant="immersive" cleanQuotes={false} />,
      { wrapper }
    );

    const props = mockDangerousCodeBlock.mock.calls[0][0] as Record<string, unknown>;
    expect(props.variant).toBe('immersive');
    expect(props.cleanQuotes).toBe(false);
  });

  it('does not apply size style mapping when cleanQuotes is true', () => {
    render(<EnhancedCodeBlock markup="<div>No size map</div>" size="inline" cleanQuotes />, {
      wrapper,
    });

    const flattened = getFlattenedStyle();
    expect(flattened).toEqual({});
  });

  it.each(CODE_BLOCK_SIZES)(
    'applies size mapping for size %s when cleanQuotes=false',
    (size) => {
      render(<EnhancedCodeBlock markup="<div>Map</div>" size={size} cleanQuotes={false} />, {
        wrapper,
      });

      const flattened = getFlattenedStyle();

      if (size === 'inline') {
        expect(flattened).toEqual(expect.objectContaining({ maxWidth: 358 }));
        return;
      }

      expect(flattened).toEqual(expect.objectContaining({ maxWidth: 390 }));
    }
  );

  it('applies immersive full width mapping when cleanQuotes=false', () => {
    render(
      <EnhancedCodeBlock
        markup="<div>Immersive full</div>"
        variant="immersive"
        size="full"
        cleanQuotes={false}
      />,
      { wrapper }
    );

    const flattened = getFlattenedStyle();
    expect(flattened).toEqual(expect.objectContaining({ width: '100%' }));
  });

  it('merges custom style with mapped container style when cleanQuotes=false', () => {
    render(
      <EnhancedCodeBlock
        markup="<div>Merged style</div>"
        cleanQuotes={false}
        size="inline"
        style={{ marginTop: 12 }}
      />,
      { wrapper }
    );

    const flattened = getFlattenedStyle();

    expect(flattened).toEqual(
      expect.objectContaining({ marginTop: 12, maxWidth: 358 })
    );
  });
});
