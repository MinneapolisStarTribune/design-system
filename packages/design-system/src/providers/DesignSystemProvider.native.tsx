import React, { useMemo } from 'react';
import { Brand, ColorScheme } from './theme-helpers';
import { BrandValidationErrorBoundary } from './BrandValidationErrorBoundary';
import { DesignSystemContext } from './DesignSystemContext';

export type { Brand };

export interface DesignSystemProviderProps {
  brand: Brand;
  forceColorScheme?: ColorScheme;
  children: React.ReactNode;
  /**
   * Ignored on React Native — exists only for API parity with the web provider
   * so that shared code can pass it without conditional logic.
   * @default false
   */
  disableFontInjection?: boolean;
}

export const DesignSystemProvider: React.FC<DesignSystemProviderProps> = ({
  brand,
  forceColorScheme = 'light',
  children,
}) => {
  const contextValue = useMemo(
    () => ({ brand, colorScheme: forceColorScheme }),
    [brand, forceColorScheme]
  );

  return (
    <DesignSystemContext.Provider value={contextValue}>
      <BrandValidationErrorBoundary>{children}</BrandValidationErrorBoundary>
    </DesignSystemContext.Provider>
  );
};
