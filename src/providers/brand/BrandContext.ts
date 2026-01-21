import { createContext } from 'react';
import { Brand } from '../theme-helpers';

/**
 * React context holding the current brand.
 * Provided by DesignSystemProvider.
 */
export const BrandContext = createContext<Brand | null>(null);
