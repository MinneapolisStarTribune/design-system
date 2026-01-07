import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { DesignSystemProvider, type Brand } from '../providers/MantineProvider';
import type { ColorScheme } from '../providers/theme-helpers';

interface RenderWithProviderOptions extends Omit<RenderOptions, 'wrapper'> {
  brand?: Brand;
  colorScheme?: ColorScheme;
}

/**
 * Render a component wrapped in DesignSystemProvider for testing
 * @param ui React element to render
 * @param options Render options including optional brand and colorScheme
 * @returns Render result from @testing-library/react
 */
export function renderWithProvider(
  ui: React.ReactElement,
  options: RenderWithProviderOptions = {}
) {
  const { brand = 'startribune', colorScheme = 'light', ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <DesignSystemProvider brand={brand} forceColorScheme={colorScheme}>
        {children}
      </DesignSystemProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
