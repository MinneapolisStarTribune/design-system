import React, { useMemo } from 'react';
import { MantineProvider as MantineProviderBase } from '@mantine/core';
import { createMantineTheme } from './mantine-theme';
import { Brand, ColorScheme } from './theme-helpers';
import { BrandContext } from './brand/BrandContext';

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
