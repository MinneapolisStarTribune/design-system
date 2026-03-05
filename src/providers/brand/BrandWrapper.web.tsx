import React from 'react';
import { Brand } from '../theme-helpers';

export interface BrandWrapperProps {
  brand: Brand;
  children: React.ReactNode;
}

/**
 * Web-specific wrapper that sets `data-brand` on a root element
 * so CSS selectors like `[data-brand='varsity']` work in SCSS modules.
 */
export const BrandWrapper: React.FC<BrandWrapperProps> = ({ brand, children }) => (
  <div data-brand={brand}>{children}</div>
);
