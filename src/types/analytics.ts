/**
 * Analytics event payload emitted by design system components.
 * Brands merge this with page metadata (from PageTrackingContext, etc.) and send to their analytics (GA4, Piano, etc.).
 */
export interface TrackingEvent {
  /** Event name (e.g. 'button_click', 'link_click') */
  event: string;
  /** Component that emitted the event (e.g. 'Button', 'IconButton') */
  component: string;
  /** Additional event-specific data */
  [key: string]: unknown;
}

/**
 * Callback for handling tracking events from design system components.
 * Brands implement this to plug in their analytics (e.g. trackEvent, Piano).
 */
export type OnTrackingEvent = (event: TrackingEvent) => void;
