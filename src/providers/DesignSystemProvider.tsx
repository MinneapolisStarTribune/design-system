import React, { useMemo, useEffect } from 'react';
import { Brand, ColorScheme } from './theme-helpers';
import { loadColorTokens, loadSpacingTokens, loadRadiusTokens, loadTypographyTokens } from './theme/load-tokens';
import { ThemeContext } from './theme/ThemeContext';
import { BrandContext } from './brand/BrandContext';
import { loadBrandFonts } from '../styles/fonts';
import { loadThemeCSS } from '../styles/themes';

/**
 * Detect if we're running in a web/browser environment
 * Works for both pure web and React Native Web
 */
const isWeb = typeof window !== 'undefined';

export type { Brand };

export interface DesignSystemProviderProps {
  brand: Brand;
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
  forceColorScheme = 'light',
  children,
  disableFontInjection = false,
}) => {
  // Load tokens from JS files (same for both web and mobile)
  // Web also loads CSS file separately for CSS variable usage in stylesheets
  const colors = useMemo(() => loadColorTokens(brand, forceColorScheme), [brand, forceColorScheme]);
  const spacing = useMemo(() => loadSpacingTokens(), []);
  const radius = useMemo(() => loadRadiusTokens(), []);
  const typography = useMemo(() => loadTypographyTokens(brand), [brand]);

  // Load CSS file for web (so CSS variables are available in stylesheets)
  useEffect(() => {
    if (isWeb) {
      loadThemeCSS(brand, forceColorScheme);
    }
  }, [brand, forceColorScheme]);

  // Load fonts (web only, unless disabled)
  useEffect(() => {
    if (isWeb && !disableFontInjection) {
      loadBrandFonts(brand);
    }
  }, [brand, disableFontInjection]);

  // Helper functions
  const themeValue = useMemo(() => ({
    colors,
    spacing,
    radius,
    typography,
    brand,
    colorScheme: forceColorScheme,
    getColor: (key: string) => colors[key],
    getSpacingValue: (key: string) => spacing[key],
    getRadiusValue: (key: string) => radius[key],
  }), [colors, spacing, radius, typography, brand, forceColorScheme]);

  return (
    <BrandContext.Provider value={brand}>
      <ThemeContext.Provider value={themeValue}>
        {children}
      </ThemeContext.Provider>
    </BrandContext.Provider>
  );
};
