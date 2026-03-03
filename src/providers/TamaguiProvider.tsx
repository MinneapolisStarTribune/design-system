import React, { useEffect, useMemo } from 'react';
import { TamaguiProvider } from '@tamagui/core';
import { config } from '../../tamagui.config';
import { Brand, ColorScheme } from './theme-helpers';
import { BrandContext } from './brand/BrandContext';
import { loadBrandFonts } from '../styles/fonts';

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

/**
 * Maps brand and color scheme to Tamagui theme name.
 * Theme names follow the pattern: `${brand}_${colorScheme}`
 *
 * @param brand - The brand (startribune | varsity)
 * @param colorScheme - The color scheme (light | dark)
 * @returns The Tamagui theme name (e.g., 'startribune_light')
 */
function getThemeName(brand: Brand, colorScheme: ColorScheme): string {
  return `${brand}_${colorScheme}`;
}

export const DesignSystemProvider: React.FC<DesignSystemProviderProps> = ({
  brand,
  forceColorScheme = 'light',
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

  // Compute theme name from brand and color scheme
  // Theme names in tamagui.config.ts follow pattern: ${brand}_${colorScheme}
  const themeName = useMemo(
    () => getThemeName(brand, forceColorScheme),
    [brand, forceColorScheme]
  );

  return (
    <BrandContext.Provider value={brand}>
      <TamaguiProvider config={config} defaultTheme={themeName}>
        {children}
      </TamaguiProvider>
    </BrandContext.Provider>
  );
};
