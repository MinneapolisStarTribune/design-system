import { renderHook } from '@testing-library/react';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { useNativeTokens } from '@/hooks/useNativeTokens';
import { nativeTokenFixtures } from '@/test-utils/nativeTokenFixtures';

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

    const { brand, colorScheme, theme } = result.current;

    expect(brand).toBe('startribune');
    expect(colorScheme).toBe('light');
    expect(theme.colorBackgroundBrand).toBe(
      nativeTokenFixtures.startribune.light.theme.colorBackgroundBrand
    );
    expect(theme.typographyArticleQuoteLarge).toEqual(
      nativeTokenFixtures.startribune.light.typography.typographyArticleQuoteLarge
    );
  });

  it('returns startribune dark tokens', () => {
    const { result } = renderHook(() => useNativeTokens(), {
      wrapper: TestWrapperInDesignSystemProvider({ colorScheme: 'dark' }),
    });

    const { brand, colorScheme, theme } = result.current;

    expect(brand).toBe('startribune');
    expect(colorScheme).toBe('dark');
    expect(theme.colorBackgroundBrand).toBe(
      nativeTokenFixtures.startribune.dark.theme.colorBackgroundBrand
    );
  });

  it('returns varsity light tokens', () => {
    const { result } = renderHook(() => useNativeTokens(), {
      wrapper: TestWrapperInDesignSystemProvider({ brand: 'varsity' }),
    });

    const { brand, colorScheme, theme } = result.current;

    expect(brand).toBe('varsity');
    expect(colorScheme).toBe('light');
    expect(theme.colorBackgroundBrand).toBe(
      nativeTokenFixtures.varsity.light.theme.colorBackgroundBrand
    );
    expect(theme.typographyArticleQuoteLarge).toEqual(
      nativeTokenFixtures.varsity.light.typography.typographyArticleQuoteLarge
    );
  });

  it('returns varsity dark tokens', () => {
    const { result } = renderHook(() => useNativeTokens(), {
      wrapper: TestWrapperInDesignSystemProvider({ brand: 'varsity', colorScheme: 'dark' }),
    });

    const { brand, colorScheme, theme } = result.current;

    expect(brand).toBe('varsity');
    expect(colorScheme).toBe('dark');
    expect(theme.colorBackgroundBrand).toBe(
      nativeTokenFixtures.varsity.dark.theme.colorBackgroundBrand
    );
  });

  it('theme includes base theme tokens', () => {
    const { result } = renderHook(() => useNativeTokens(), {
      wrapper: TestWrapperInDesignSystemProvider(),
    });

    const { theme } = result.current;

    expect(theme).toHaveProperty('colorBackgroundBrand');
    expect(theme.colorBackgroundBrand).toBe(
      nativeTokenFixtures.startribune.light.theme.colorBackgroundBrand
    );
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
