import '@/test-utils/mockNativeTokens';
import { renderHook } from '@testing-library/react';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { useNativeTokens } from '@/hooks/useNativeTokens';

describe('useNativeTokens', () => {
  it('throws when used outside a DesignSystemProvider', () => {
    expect(() => renderHook(() => useNativeTokens())).toThrow(
      'useNativeTokens: must be used within a DesignSystemProvider.'
    );
  });

  it('returns startribune light tokens', () => {
    const { result } = renderHook(() => useNativeTokens(), {
      wrapper: TestWrapperInDesignSystemProvider(),
    });

    const { brand, colorScheme } = result.current;

    expect(brand).toBe('startribune');
    expect(colorScheme).toBe('light');
  });

  it('returns startribune dark tokens', () => {
    const { result } = renderHook(() => useNativeTokens(), {
      wrapper: TestWrapperInDesignSystemProvider({ colorScheme: 'dark' }),
    });

    const { brand, colorScheme } = result.current;

    expect(brand).toBe('startribune');
    expect(colorScheme).toBe('dark');
  });

  it('returns varsity light tokens', () => {
    const { result } = renderHook(() => useNativeTokens(), {
      wrapper: TestWrapperInDesignSystemProvider({ brand: 'varsity' }),
    });

    const { brand, colorScheme } = result.current;

    expect(brand).toBe('varsity');
    expect(colorScheme).toBe('light');
  });

  it('returns varsity dark tokens', () => {
    const { result } = renderHook(() => useNativeTokens(), {
      wrapper: TestWrapperInDesignSystemProvider({ brand: 'varsity', colorScheme: 'dark' }),
    });

    const { brand, colorScheme } = result.current;

    expect(brand).toBe('varsity');
    expect(colorScheme).toBe('dark');
  });

  it('theme includes base theme tokens', () => {
    const { result } = renderHook(() => useNativeTokens(), {
      wrapper: TestWrapperInDesignSystemProvider(),
    });

    const { theme } = result.current;

    expect(theme).toHaveProperty('colorBackgroundBrand');
    expect(theme.colorBackgroundBrand).toBe('#strib-light');
  });

  it('theme includes typography tokens', () => {
    const { result } = renderHook(() => useNativeTokens(), {
      wrapper: TestWrapperInDesignSystemProvider(),
    });

    const { theme } = result.current;

    expect(theme).toHaveProperty('typographyArticleQuoteLarge');
    expect(theme).toHaveProperty('typographyArticleQuoteSmall');
  });

  it('returns different tokens for different brands', () => {
    const { result: strib } = renderHook(() => useNativeTokens(), {
      wrapper: TestWrapperInDesignSystemProvider(),
    });
    const { result: varsity } = renderHook(() => useNativeTokens(), {
      wrapper: TestWrapperInDesignSystemProvider({ brand: 'varsity' }),
    });

    const { theme: stribTheme } = strib.current;
    const { theme: varsityTheme } = varsity.current;

    expect(stribTheme.colorBackgroundBrand).not.toBe(varsityTheme.colorBackgroundBrand);
  });
});
