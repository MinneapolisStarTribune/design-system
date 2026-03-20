# Analytics Integration

Design system components are **analytics-ready**: they emit tracking events on user interaction. Brands provide the tracking implementation and page metadata.

## Separation of Concerns

| Responsibility     | Design System                                       | Brand (e.g. startribune-web)           |
| ------------------ | --------------------------------------------------- | -------------------------------------- |
| **UI**             | Components render and handle interaction            | —                                      |
| **Event emission** | Components call `track()` with standardized payload | —                                      |
| **Page metadata**  | —                                                   | PageTrackingContext, getMetadata, etc. |
| **Tracking logic** | —                                                   | GA4, Piano, trackEvent, etc.           |

## Setup for Brands

### 1. Wrap your app with AnalyticsProvider

```tsx
import { AnalyticsProvider, DesignSystemProvider } from '@minneapolisstartribune/design-system/web';
import { usePageTracking } from './contexts/PageTracking'; // your page context

function App() {
  const { pageTracking } = usePageTracking();

  const handleTrackingEvent = (event) => {
    // Merge component event with your page metadata
    const payload = { ...pageTracking, ...event };
    trackEvent(event.event, payload); // your GA4/Piano/etc.
  };

  return (
    <DesignSystemProvider brand="startribune" forceColorScheme="light">
      <AnalyticsProvider
        onTrackingEvent={handleTrackingEvent}
        warnWhenUnhandled={process.env.NODE_ENV === 'development'}
      >
        {/* Your app */}
      </AnalyticsProvider>
    </DesignSystemProvider>
  );
}
```

### 2. Example: startribune-web integration

```tsx
// In startribune-web layout or root
import { AnalyticsProvider } from '@minneapolisstartribune/design-system/web';
import { usePageTrackingContext } from '@/contexts/global/PageTracking.context';
import { trackEvent } from '@/lib/helpers/tracking/tracking';

function RootLayout({ children }) {
  const { pageTracking } = usePageTrackingContext();

  return (
    <AnalyticsProvider
      onTrackingEvent={(event) => {
        trackEvent(event.event, { ...pageTracking, ...event });
      }}
      warnWhenUnhandled={process.env.NODE_ENV === 'development'}
    >
      {children}
    </AnalyticsProvider>
  );
}
```

## Event Payloads

Components emit `TrackingEvent` objects:

```ts
interface TrackingEvent {
  event: string; // e.g. 'button_click'
  component: string; // e.g. 'Button'
  [key: string]: unknown; // component-specific data
}
```

### Button

On click (base payload + any `analytics` prop):

```json
{
  "color": "brand",
  "component": "Button",
  "cta_type": "subscribe",
  "event": "button_click",
  "icon": "arrow-right",
  "label": "Subscribe",
  "module_position": "hero",
  "variant": "filled"
}
```

**Per-button custom data:** Pass the `analytics` prop to add context-specific fields:

```tsx
<Button
  label="Subscribe"
  analytics={{ cta_type: 'subscribe', module_position: 'hero' }}
  onClick={...}
/>
<Button
  label="Read More"
  analytics={{ cta_type: 'read_more', module_name: 'article_card' }}
  onClick={...}
/>
```

### Checkbox

On change (base payload + any `analytics` prop):

```json
{
  "component": "Checkbox",
  "event": "checkbox_change",
  "label": "Subscribe to newsletter",
  "checked": true,
  "variant": "neutral"
}
```

**Per-checkbox custom data:** Pass the `analytics` prop to add context-specific fields.

### CheckboxGroup

CheckboxGroup passes `analytics` to each child Checkbox. Events include `option_value` and `is_category` (for category mode):

```json
{
  "component": "Checkbox",
  "event": "checkbox_change",
  "label": "Option A",
  "checked": true,
  "option_value": "a",
  "form_field": "preferences"
}
```

### TextInput

On blur (when user leaves the field):

```json
{
  "component": "TextInput",
  "event": "text_input_blur",
  "value_length": 42
}
```

**Per-input custom data:** Pass the `analytics` prop (e.g. `form_field`, `module_name`).

### Toast

On dismiss (when user clicks close):

```json
{
  "component": "Toast",
  "event": "toast_dismiss",
  "title": "Success",
  "variant": "success"
}
```

### PhotoLayout

On expand (when user clicks to expand an image):

```json
{
  "component": "PhotoLayout",
  "event": "photo_layout_expand",
  "image_index": 0,
  "image_alt": "Description",
  "layout_type": "2up"
}
```

On dialog close:

```json
{
  "component": "PhotoLayoutDialog",
  "event": "photo_layout_dialog_close",
  "image_alt": "Description"
}
```

### Popover

On open (when user clicks trigger):

```json
{
  "component": "Popover",
  "event": "popover_open",
  "placement": "bottom"
}
```

On close (when user dismisses via close button, outside click, or Escape):

```json
{
  "component": "Popover",
  "event": "popover_close",
  "placement": "bottom"
}
```

**Per-popover custom data:** Pass the `analytics` prop (e.g. `module_name`, `trigger_context`).

### Image

When the image is clickable (has `onClick`), on click:

```json
{
  "component": "Image",
  "event": "image_click",
  "alt": "Image description"
}
```

**Per-image custom data:** Pass the `analytics` prop when using a clickable image.

## Optional: Dev Warning

Set `warnWhenUnhandled={true}` in development to see console warnings when components emit events but no handler is provided. Helps catch missing AnalyticsProvider during migration.
