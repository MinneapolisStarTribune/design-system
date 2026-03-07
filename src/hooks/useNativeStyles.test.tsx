import '@/test-utils/mockNativeTokens';
import { renderHook } from '@testing-library/react';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';

import { useNativeStyles, NativeTheme } from '@/hooks/useNativeStyles';

// Module-level factory — mirrors how components define createStyles
const createStyles = (theme: NativeTheme) => ({
  heading: { color: theme.colorBackgroundBrand },
  body: { fontSize: theme.typographyArticleQuoteLarge?.fontSize },
});

describe('useNativeStyles', () => {
  it('returns the value produced by the factory', () => {
    const { result } = renderHook(() => useNativeStyles(createStyles), {
      wrapper: TestWrapperInDesignSystemProvider(),
    });

    expect(result.current.heading).toEqual({ color: '#strib-light' });
    expect(result.current.body).toEqual({ fontSize: 24 });
  });

  it('returns different styles for a different brand', () => {
    const { result } = renderHook(() => useNativeStyles(createStyles), {
      wrapper: TestWrapperInDesignSystemProvider({ brand: 'varsity' }),
    });

    expect(result.current.heading).toEqual({ color: '#varsity-light' });
    expect(result.current.body).toEqual({ fontSize: 22 });
  });

  it('returns a stable reference when theme has not changed', () => {
    const { result, rerender } = renderHook(() => useNativeStyles(createStyles), {
      wrapper: TestWrapperInDesignSystemProvider(),
    });

    const first = result.current;
    rerender();
    const second = result.current;

    expect(first).toBe(second);
  });
});
