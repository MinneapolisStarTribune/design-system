import React, { useEffect, useMemo } from 'react';
import { MantineProvider as MantineProviderBase } from '@mantine/core';
import { createMantineTheme } from './mantine-theme';
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

  // Recreate theme when brand or colorScheme changes
  const theme = useMemo(
    () => createMantineTheme(brand, forceColorScheme),
    [brand, forceColorScheme]
  );

  return (
    <BrandContext.Provider value={brand}>
      <MantineProviderBase theme={theme} forceColorScheme={forceColorScheme}>
        {children}
      </MantineProviderBase>
    </BrandContext.Provider>
  );
};
