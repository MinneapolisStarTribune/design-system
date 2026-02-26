import { useCallback, useContext } from 'react';
import { AnalyticsContext } from '../providers/AnalyticsProvider';
import type { TrackingEvent } from '../types/analytics';

/**
 * Hook to emit tracking events from design system components.
 * Brands provide the handler via AnalyticsProvider; components call track() on user interaction.
 *
 * @example
 * // In Button component:
 * const { track } = useAnalytics();
 * const handleClick = (e) => {
 *   track({ event: 'button_click', component: 'Button', label });
 *   onClick?.(e);
 * };
 */
export function useAnalytics() {
  const { onTrackingEvent, warnWhenUnhandled } = useContext(AnalyticsContext);

  const track = useCallback(
    (event: TrackingEvent) => {
      if (onTrackingEvent) {
        onTrackingEvent(event);
      } else if (warnWhenUnhandled && process.env.NODE_ENV === 'development') {
        console.warn(
          `[Design System] Tracking event emitted but no handler provided. ` +
            `Wrap your app with <AnalyticsProvider onTrackingEvent={...} /> to handle:`,
          event
        );
      }
    },
    [onTrackingEvent, warnWhenUnhandled]
  );

  return { track };
}
