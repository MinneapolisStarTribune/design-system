import { useMemo } from 'react';
import { useNativeTokens } from './useNativeTokens';

type NativeTheme = ReturnType<typeof useNativeTokens>['theme'];

/**
 * Memoises style creation against the current native theme tokens.
 *
 * The `factory` function receives the resolved theme and should return
 * the result of `StyleSheet.create(…)`.  Define it at **module level**
 * (outside the component) so the reference is stable across renders.
 *
 * @example
 * ```tsx
 * import { useNativeStyles } from '@minneapolisstartribune/design-system/native';
 *
 * export const MyComponent = () => {
 *   const styles = useNativeStyles(createStyles);
 *   return <View style={styles.container} />;
 * };
 *
 * const createStyles = (theme) =>
 *   StyleSheet.create({
 *     container: { backgroundColor: theme.colorBackgroundBrand },
 *   });
 * ```
 */
export function useNativeStyles<T>(factory: (theme: NativeTheme) => T): T {
  const { theme } = useNativeTokens();
  // `factory` is expected to be a module-level function (stable reference).
  // Including it in deps keeps the linter happy.
  return useMemo(() => factory(theme), [theme, factory]);
}
