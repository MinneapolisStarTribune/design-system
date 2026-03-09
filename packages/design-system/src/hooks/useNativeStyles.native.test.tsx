import { renderHook } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { nativeTokenFixtures } from '@/test-utils/nativeTokenFixtures';

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

    expect(result.current.heading).toEqual({
      color: nativeTokenFixtures.startribune.light.theme.colorBackgroundBrand,
    });
    expect(result.current.body).toEqual({
      fontSize:
        nativeTokenFixtures.startribune.light.typography.typographyArticleQuoteLarge.fontSize,
    });
  });

  it('returns different styles for a different brand', () => {
    const { result } = renderHook(() => useNativeStyles(createStyles), {
      wrapper: TestWrapperInDesignSystemProvider({ brand: 'varsity' }),
    });

    expect(result.current.heading).toEqual({
      color: nativeTokenFixtures.varsity.light.theme.colorBackgroundBrand,
    });
    expect(result.current.body).toEqual({
      fontSize: nativeTokenFixtures.varsity.light.typography.typographyArticleQuoteLarge.fontSize,
    });
  });

  it('returns a stable reference when theme has not changed', () => {
    const { result, rerender } = renderHook(
      ({ rerenderToken }: { rerenderToken: number }) => {
        void rerenderToken;
        return useNativeStyles(createStyles);
      },
      {
        initialProps: { rerenderToken: 0 },
        wrapper: TestWrapperInDesignSystemProvider(),
      }
    );

    const first = result.current;
    rerender({ rerenderToken: 1 });
    const second = result.current;

    expect(first).toBe(second);
  });
});
