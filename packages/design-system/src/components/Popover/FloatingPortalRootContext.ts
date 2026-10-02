'use client';

import { createContext } from 'react';

/**
 * Portal root for the components built on `FloatingSurface`. This context is internal. Consumers
 * set it through `PopoverPortalRootContext` or `PopoverPortalRootProvider`, which use this context.
 */
export const FloatingPortalRootContext = createContext<HTMLElement | null>(null);
