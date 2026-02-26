import { createContext, useContext } from 'react';
import { Brand, ColorScheme } from '../theme-helpers';

interface ThemeContextValue {
  // Direct access to token objects (PascalCase keys, e.g., ColorButtonFilledBackground)
  colors: Record<string, string>;
  spacing: Record<string, number>;
  radius: Record<string, number>;
  typography: Record<string, any>; 
  
  // Brand and color scheme
  brand: Brand;
  colorScheme: ColorScheme;
  
  // Helper functions for easy access (use PascalCase keys)
  getColor: (key: string) => string | undefined;
  getSpacingValue: (key: string) => number | undefined;
  getRadiusValue: (key: string) => number | undefined;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within DesignSystemProvider');
  }
  return context;
}

export { ThemeContext };
