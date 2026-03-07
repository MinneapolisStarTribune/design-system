import React from 'react';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
import type { Brand, ColorScheme } from '@/providers/theme-helpers';

/**
 * Test wrapper that renders children inside a DesignSystemContext.Provider.
 * Use with `renderHook` or `render` to simulate being inside a DesignSystemProvider.
 */
export function TestWrapperInDesignSystemProvider({
  brand = 'startribune',
  colorScheme = 'light',
}: { brand?: Brand; colorScheme?: ColorScheme } = {}) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <DesignSystemContext.Provider value={{ brand, colorScheme }}>
      {children}
    </DesignSystemContext.Provider>
  );
  Wrapper.displayName = 'TestWrapperInDesignSystemProvider';
  return Wrapper;
}
