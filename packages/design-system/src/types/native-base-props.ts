import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { BaseProps } from './globalTypes';

/**
 * Helpers for React Native public APIs in `*.types.ts` (alongside web `*Props`).
 *
 * **`NativeTextStylingProps` / `NativeViewStylingProps` / `NativeImageStylingProps`** — Take a web props
 * object, strip `className` and CSS `style`, and expose RN `style` (`TextStyle` / `ViewStyle` /
 * `ImageStyle`). Use when native and web share the same logical props (e.g. typography with `BaseProps`).
 *
 * **Explicit `*NativeProps` on some headings** — Web types extend `HTMLAttributes` + `ColorVariantProps`.
 * Native types cannot extend DOM attributes, so we define a small RN-only interface. Fields that look
 * “duplicated” on purpose:
 * - **`color`** — Same semantic tokens as web (`ColorVariantProps`); listed explicitly because native
 *   does not inherit that interface from the web `extends` chain.
 * - **`dataTestId`** — Matches {@link BaseProps}; surfaced for tests (`testID` on RN components).
 * - **`style`** — RN layout/visual overrides; replaces web `className` / CSS `style`.
 */

/**
 * Shared props for React Native components: drops web-only `className` and CSS `style`
 * from {@link BaseProps}. Pair with {@link NativeTextStylingProps} or {@link NativeViewStylingProps}.
 */
export type NativeBaseProps = Omit<BaseProps, 'className' | 'style'>;

/**
 * Replaces web `style` with React Native text styles and removes `className`.
 */
export type NativeTextStylingProps<P extends object> = Omit<P, 'className' | 'style'> & {
  style?: StyleProp<TextStyle>;
};

/**
 * Replaces web `style` with React Native view styles and removes `className`.
 */
export type NativeViewStylingProps<P extends object> = Omit<P, 'className' | 'style'> & {
  style?: StyleProp<ViewStyle>;
};

/**
 * Replaces web `style` with React Native image styles and removes `className`.
 */
export type NativeImageStylingProps<P extends object> = Omit<P, 'className' | 'style'> & {
  style?: StyleProp<ImageStyle>;
};
