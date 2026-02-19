import React, { createContext } from 'react';
import type { OnTrackingEvent } from '../types/analytics';

export interface AnalyticsContextValue {
  /** Callback invoked when a component emits a tracking event. Brands implement this with their analytics (GA4, Piano, etc.). */
  onTrackingEvent?: OnTrackingEvent;
  /** When true, logs a dev warning if a component emits an event but no handler is provided. Default: false. */
  warnWhenUnhandled?: boolean;
}

const defaultValue: AnalyticsContextValue = {
  onTrackingEvent: undefined,
  warnWhenUnhandled: false,
};

export const AnalyticsContext = createContext<AnalyticsContextValue>(defaultValue);

export interface AnalyticsProviderProps {
  /** Callback for tracking events. Brands merge event payload with page metadata and send to their analytics. */
  onTrackingEvent?: OnTrackingEvent;
  /** Log console warning in dev when events are emitted but no handler is provided. */
  warnWhenUnhandled?: boolean;
  children: React.ReactNode;
}

/**
 * Provider for analytics/tracking. Brands wrap their app with this and pass their tracking logic.
 * Components emit events via useAnalytics(); the brand's onTrackingEvent receives them and can
 * merge with page metadata (PageTrackingContext, etc.) before sending to GA4, Piano, etc.
 *
 * @example
 * // In startribune-web (or other brand):
 * <AnalyticsProvider
 *   onTrackingEvent={(event) => {
 *     const payload = { ...pageTracking, ...event };
 *     trackEvent(event.event, payload);
 *   }}
 *   warnWhenUnhandled={process.env.NODE_ENV === 'development'}
 * >
 *   <App />
 * </AnalyticsProvider>
 */
export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  onTrackingEvent,
  warnWhenUnhandled = false,
  children,
}) => {
  const value: AnalyticsContextValue = {
    onTrackingEvent,
    warnWhenUnhandled,
  };
  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};
