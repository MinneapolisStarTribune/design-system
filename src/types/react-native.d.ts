/**
 * Ambient type declarations for react-native.
 * react-native is a peer dependency - consumers provide it at runtime.
 * These minimal types allow the design system to type-check native components
 * during development without requiring the full react-native package.
 */
declare module 'react-native' {
  import type { ComponentType } from 'react';

  export interface TextStyle {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string | number;
    fontStyle?: 'normal' | 'italic';
    lineHeight?: number;
    letterSpacing?: number;
  }

  export interface TextProps {
    style?: TextStyle | TextStyle[];
    testID?: string;
    accessibilityRole?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
  }

  export const Text: ComponentType<TextProps>;
  export const StyleSheet: {
    create: <T extends Record<string, TextStyle>>(styles: T) => T;
  };
}
