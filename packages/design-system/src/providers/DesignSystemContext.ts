'use client';

import { createContext } from 'react';
import type { Brand, ColorScheme } from './theme-helpers';

export interface DesignSystemContextValue {
  brand: Brand;
  colorScheme: ColorScheme;
}

/**
 * React context holding the current brand and color scheme.
 *
 * @remarks
 * This context is provided by DesignSystemProvider and consumed by
 * hooks (useNativeStyles / useNativeStylesWithDefaults) and components that need brand-specific
 * behavior or validation.
 */
export const DesignSystemContext = createContext<DesignSystemContextValue | null>(null);
