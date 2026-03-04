import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { DesignSystemProvider, type Brand } from '../providers/MantineProvider';
import { AnalyticsProvider } from '../providers/AnalyticsProvider';
import type { ColorScheme } from '../providers/theme-helpers';
import type { OnTrackingEvent } from '../types/analytics';

interface RenderWithProviderOptions extends Omit<RenderOptions, 'wrapper'> {
  brand?: Brand;
  colorScheme?: ColorScheme;
  /** Mock handler for analytics events. When provided, wraps with AnalyticsProvider for testing. */
  mockOnTrackingEvent?: OnTrackingEvent;
}

/**
 * Render a component wrapped in DesignSystemProvider for testing
 * @param ui React element to render
 * @param options Render options including optional brand, colorScheme, and mockOnTrackingEvent
 * @returns Render result from @testing-library/react
 */
export function renderWithProvider(
  ui: React.ReactElement,
  options: RenderWithProviderOptions = {}
) {
  const {
    brand = 'startribune',
    colorScheme = 'light',
    mockOnTrackingEvent,
    ...renderOptions
  } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const content = mockOnTrackingEvent ? (
      <AnalyticsProvider onTrackingEvent={mockOnTrackingEvent}>{children}</AnalyticsProvider>
    ) : (
      children
    );

    return (
      <DesignSystemProvider brand={brand} forceColorScheme={colorScheme}>
        {content}
      </DesignSystemProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
