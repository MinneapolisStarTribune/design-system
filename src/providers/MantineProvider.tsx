import React, { useMemo } from 'react';
import { MantineProvider as MantineProviderBase } from '@mantine/core';
import { createMantineTheme } from './mantine-theme';
import { Brand, ColorScheme } from './theme-helpers';

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
    <MantineProviderBase theme={theme} forceColorScheme={forceColorScheme}>
      {children}
    </MantineProviderBase>
  );
};
