'use client';

import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { Brand, ColorScheme } from './theme-helpers';
import { BrandValidationErrorBoundary } from './BrandValidationErrorBoundary';
import { DesignSystemContext } from './DesignSystemContext';
import { loadBrandFonts } from '../styles/fonts';
import { SnackProvider } from './SnackProvider/SnackProvider';

export type { Brand };

/** Set on `<html>` by the web provider so components (e.g. Button `surface="dark"`) can scope CSS by product. */
export const DS_ROOT_BRAND_ATTRIBUTE = 'data-ds-brand';

/**
 * Set on `<html>` by the web provider when `forceColorScheme` is passed, so the scoped theme CSS
 * (`{brand}-{scheme}.scoped.css`) and `[data-theme]` component styles follow the prop.
 */
export const DS_ROOT_THEME_ATTRIBUTE = 'data-theme';

export interface DesignSystemProviderProps {
  brand: Brand;
  /**
   * Color scheme for components that read it from context. When passed, it is also set as
   * `data-theme` on `<html>`; omit it to manage `data-theme` yourself.
   * @default 'light'
   */
  forceColorScheme?: ColorScheme;
  children: React.ReactNode;
  /**
   * Set to true when the consumer handles font loading via SSR (e.g. Next.js layout.tsx).
   * Prevents the client-side <link> injection that would 404 if fonts are not at the
   * relative path this package expects.
   * @default false
   */
  disableFontInjection?: boolean;
}

export const DesignSystemProvider: React.FC<DesignSystemProviderProps> = ({
  brand,
  forceColorScheme,
  children,
  disableFontInjection = false,
}) => {
  // Load brand-specific fonts by injecting a <link> element.
  // Skip when the consumer handles font loading via SSR to avoid a 404
  // (the relative path here resolves to /fonts/font-face/<brand>.css which
  // won't exist unless the consumer explicitly serves it there).
  useEffect(() => {
    if (disableFontInjection) return;
    loadBrandFonts(brand);
  }, [brand, disableFontInjection]);

  const contextValue = useMemo(
    () => ({ brand, colorScheme: forceColorScheme ?? 'light' }),
    [brand, forceColorScheme]
  );

  useLayoutEffect(() => {
    document.documentElement.setAttribute(DS_ROOT_BRAND_ATTRIBUTE, brand);
  }, [brand]);

  useLayoutEffect(() => {
    if (!forceColorScheme) return;
    const root = document.documentElement;
    const previous = root.getAttribute(DS_ROOT_THEME_ATTRIBUTE);
    root.setAttribute(DS_ROOT_THEME_ATTRIBUTE, forceColorScheme);
    return () => {
      if (previous === null) {
        root.removeAttribute(DS_ROOT_THEME_ATTRIBUTE);
      } else {
        root.setAttribute(DS_ROOT_THEME_ATTRIBUTE, previous);
      }
    };
  }, [forceColorScheme]);

  return (
    <DesignSystemContext.Provider value={contextValue}>
      <BrandValidationErrorBoundary>
        <SnackProvider>{children}</SnackProvider>
      </BrandValidationErrorBoundary>
    </DesignSystemContext.Provider>
  );
};
