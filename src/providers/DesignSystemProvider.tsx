import React, { useEffect, useMemo } from 'react';
import { Brand, ColorScheme } from './theme-helpers';
import { DesignSystemContext } from './DesignSystemContext';
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

  const contextValue = useMemo(
    () => ({ brand, colorScheme: forceColorScheme }),
    [brand, forceColorScheme]
  );

  return (
    <DesignSystemContext.Provider value={contextValue}>{children}</DesignSystemContext.Provider>
  );
};
