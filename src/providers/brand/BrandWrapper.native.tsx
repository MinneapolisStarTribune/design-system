import React from 'react';
import { Brand } from '../theme-helpers';

interface BrandWrapperProps {
  brand: Brand;
  children: React.ReactNode;
}

/**
 * Native passthrough — no HTML attributes exist in React Native.
 * Brand theming on native is handled via BrandContext + Tamagui themes.
 */
export const BrandWrapper: React.FC<BrandWrapperProps> = ({ children }) => <>{children}</>;
