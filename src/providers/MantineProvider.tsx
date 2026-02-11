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
}

export const DesignSystemProvider: React.FC<DesignSystemProviderProps> = ({
  brand,
  forceColorScheme = 'light',
  children,
}) => {
  // Load brand-specific fonts when brand changes.
  // In production: brand is set once, fonts load once.
  // In Storybook: brand may change dynamically, fonts load as needed.
  // loadBrandFonts is idempotent and prevents duplicate link elements.
  useEffect(() => {
    loadBrandFonts(brand);
  }, [brand]);

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
