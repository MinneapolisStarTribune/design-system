import { createContext } from 'react';
import { Brand } from '../theme-helpers';

/**
 * React context holding the current brand.
 *
 * @remarks
 * This context is provided by DesignSystemProvider and consumed by
 * components that need brand-specific behavior or validation.
 * @defaultValue null
 */
export const BrandContext = createContext<Brand | null>(null);
