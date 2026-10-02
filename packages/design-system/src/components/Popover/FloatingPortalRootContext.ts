'use client';

import { createContext } from 'react';

/**
 * Internal portal root for components that use `FloatingSurface`.
 */
export const FloatingPortalRootContext = createContext<HTMLElement | null>(null);
