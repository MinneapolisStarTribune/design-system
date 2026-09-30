# Web Integration

Using the design system in web (React) applications.

## Dependencies

For **web** (using the `/web` entry), install the pinned peer versions (match the design system’s peerDependencies):

```bash
yarn add react@19.0.0 react-dom@19.0.0 @floating-ui/react@0.27.19
```

You do not need `react-native` or `@floating-ui/react-native`.

### PianoCoachmark's optional peer

`PianoCoachmark` (see [Coachmark and PianoCoachmark](#coachmark-and-pianocoachmark) below) needs one more peer, installed only if you use it:

```bash
yarn add @minneapolisstartribune/external-trigger
```

Everything else in the package — including plain `Coachmark` — has no dependency on it. It's imported from a separate entry point (`@minneapolisstartribune/design-system/web/piano`) specifically so that importing anything from the main `/web` entry point never resolves this dependency, even if it isn't installed.

### Popover portal root (optional)

By default, Popover content is rendered into `document.body`. That can cause issues when:

- Popovers live inside a **modal** or **sidebar** and should be clipped or stacked with that container
- You use **Storybook** and want popover content to stay within the story frame
- You need a **custom container** for styling or layout (e.g. a dedicated overlay layer)

**Option 1: `PopoverPortalRootProvider`** — Wrap the part of the tree where Popovers should render. The provider creates a wrapper `div` and uses it as the portal target for any Popover under it.

```tsx
import {
  Popover,
  PopoverPortalRootProvider,
  Button,
} from '@minneapolisstartribune/design-system/web';

function SidebarWithPopover() {
  return (
    <aside className="my-sidebar" style={{ overflow: 'hidden' }}>
      <PopoverPortalRootProvider>
        <Popover trigger={<Button label="Menu" onClick={() => {}} />} aria-label="Options">
          <p>This content renders inside the sidebar, not document.body.</p>
        </Popover>
      </PopoverPortalRootProvider>
    </aside>
  );
}
```

**Option 2: `PopoverPortalRootContext`** — For advanced cases where you already have an `HTMLElement` (e.g. a ref to a modal container), you can provide it via context instead of using the provider. You’d create your own wrapper that uses `PopoverPortalRootContext.Provider` with `value={yourElement}`.

Most apps only need **Option 1**.

## Quick Start

Import component styles, then a theme CSS file (typography classes + CSS variables in one file), then wrap your app with `DesignSystemProvider`:

```tsx
import '@minneapolisstartribune/design-system/web/startribune-light.css';
import '@minneapolisstartribune/design-system/web/components.css';
import { DesignSystemProvider, Button } from '@minneapolisstartribune/design-system/web';

function App() {
  return (
    <DesignSystemProvider brand="startribune" forceColorScheme="light">
      <Button label="Click me" onClick={() => {}} />
    </DesignSystemProvider>
  );
}
```

The `brand` prop must match the CSS file brand; `forceColorScheme` must match the scheme. Fonts are loaded automatically by the provider.

## Coachmark and PianoCoachmark

`Coachmark` is a dismissible, pointed callout for an unprompted, single action (e.g. a CMS-driven prompt to create an account or favorite something) — anchored to `children`, always externally controlled via `open`/`onOpenChange` (it never opens itself on hover, focus, or click, unlike `Tooltip`).

```tsx
import { useState } from 'react';
import { Coachmark, Button } from '@minneapolisstartribune/design-system/web';

function FavoriteButtonWithCoachmark() {
  const [open, setOpen] = useState(true);

  return (
    <Coachmark
      open={open}
      onOpenChange={setOpen}
      title="Added to favorites"
      description="You'll now see updates for this team in your feed."
    >
      <Button label="Favorite" onClick={() => {}} />
    </Coachmark>
  );
}
```

Key props: `position` (`COACHMARK_POSITIONS` — which side of `children` it opens on, defaults to `'bottom-center'`), `alignment` (`'left' | 'center'`, defaults to `'center'` — horizontal alignment of the title/description, independent of whether `icon` is given), `icon`, `badgeText`, `ctaText`/`onAction`/`actionHref`, `secondaryContent`, and `dismissOnOutsideClick` (defaults to `false` — an unprompted coachmark should only close via its own controls unless you opt in; this also gates Escape).

### PianoCoachmark

`PianoCoachmark` wraps `Coachmark` and drives it from Piano's `setResponseVariable` event instead of your own state, via `@minneapolisstartribune/external-trigger` (see [PianoCoachmark's optional peer](#pianocoachmarks-optional-peer) above). Import it from the separate `/web/piano` entry point, not the main one:

```tsx
// Once, near the root:
import { ExternalTriggerProvider } from '@minneapolisstartribune/external-trigger';

function App({ children }) {
  return <ExternalTriggerProvider>{children}</ExternalTriggerProvider>;
}
```

```tsx
// In your Piano `setResponseVariable` listener:
import { useTriggerExternal } from '@minneapolisstartribune/external-trigger';
import {
  parsePianoCoachmarkResponseVariables,
  type PianoCoachmarkPayload,
} from '@minneapolisstartribune/design-system/web/piano';

const trigger = useTriggerExternal<PianoCoachmarkPayload>();

// responseVariables comes from Piano's own event payload.
const parsed = parsePianoCoachmarkResponseVariables(responseVariables);
if (parsed) trigger(parsed.id, parsed.payload);
```

```tsx
// At each anchor:
import { PianoCoachmark, type PianoCtaActionRegistry } from '@minneapolisstartribune/design-system/web/piano';

const ctaActions: PianoCtaActionRegistry = {
  signup: {
    onClick: ({ dismiss }) => {
      dismiss();
      // ...open your own signup flow
    },
  },
};

<PianoCoachmark id="newsletter" ctaActions={ctaActions}>
  <Button label="Newsletters" onClick={() => {}} />
</PianoCoachmark>;
```

`parsePianoCoachmarkResponseVariables` requires `id`/`title`/`description`/`ctaText`/`ctaType` all present in Piano's response variables — if any one is missing, it returns `null` and nothing triggers, silently (no error). `ctaActions` is a `ctaType` → `PianoCtaAction` registry your app supplies; each entry needs a primary action (`href` for a link, or `onClick` for a handler — not both) and can optionally supply `renderSecondary` for content below the button (e.g. a login link), shown when the payload's `showLogin` is `true`. Both `onClick` and `renderSecondary` receive `{ dismiss }` to close the coachmark, e.g. after handling the action.

## Available Themes

| Brand        | Light                   | Dark                   |
| ------------ | ----------------------- | ---------------------- |
| Star Tribune | `startribune-light.css` | `startribune-dark.css` |
| Varsity      | `varsity-light.css`     | `varsity-dark.css`     |

### Static vs Dynamic Loading

**Static** — import the CSS file at the top of your entry file (shown above).

**Dynamic** — swap `<link>` elements at runtime if you need to switch themes:

**Option B: Dynamic loading (if you need to switch themes at runtime)**

```tsx
import { useEffect, useState } from 'react';
import '@minneapolisstartribune/design-system/web/components.css';
import { DesignSystemProvider } from '@minneapolisstartribune/design-system/web';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const brand = 'startribune'; // or 'varsity'

  useEffect(() => {
    // Remove any existing theme link
    const existingLink = document.getElementById('design-system-theme');
    if (existingLink) {
      existingLink.remove();
    }

    // Load the correct combined CSS file (typography + themes)
    // Note: Adjust this path based on how your bundler resolves node_modules
    // For Vite: `/node_modules/@minneapolisstartribune/design-system/dist/web/${brand}-${theme}.css`
    // For Webpack/CRA: You may need to use a dynamic import or copy files to public folder
    const link = document.createElement('link');
    link.id = 'design-system-theme';
    link.rel = 'stylesheet';
    link.href = `/node_modules/@minneapolisstartribune/design-system/dist/web/${brand}-${theme}.css`;
    document.head.appendChild(link);

    // Cleanup on unmount
    return () => {
      const linkToRemove = document.getElementById('design-system-theme');
      if (linkToRemove) {
        linkToRemove.remove();
      }
    };
  }, [brand, theme]);

  return (
    <DesignSystemProvider brand={brand} forceColorScheme={theme}>
      {/* Your app with theme switcher */}
      <button onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}>
        Toggle Theme
      </button>
    </DesignSystemProvider>
  );
}
```

## Using CSS Variables Directly

All themes expose the same token names, so you can use them in CSS modules or inline styles:

```css
.my-component {
  background: var(--color-brand-primary-strib-emerald-green);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-subtle);
}
```

## Typography text colors

Typography components (headings, body copy, labels, quotes, etc.) accept a `color` prop typed as **`TextColor`**: short keys such as `brand-01`, `on-light-primary`, and `state-attention-on-dark` that resolve to `var(--color-text-*)`. This is **not** the same as **`Button`’s** `color` prop, which uses module variants `neutral`, `brand`, and `brand-accent` for button styles.

## Icons

Import only the icons you need (tree-shakeable). Icons are SVG components and accept standard SVG/React props such as `width`, `height`, `className`, `fill`, and `aria-*`.

```tsx
import { CloseIcon, SearchIcon } from '@minneapolisstartribune/design-system/web';
```

### Customizing icon color

Icons use `fill="currentColor"` by default (when built with SVGR), so they inherit the parent’s text color. To set color:

**1. Inherit from parent** — Put the icon inside an element that has the desired `color` (e.g. a button or a `span` with a class). The icon will match that color.

```tsx
<span style={{ color: 'var(--color-icon-on-light-primary)' }}>
  <SearchIcon width={24} height={24} aria-hidden />
</span>
```

**2. Explicit `fill`** — Pass a design token or any valid CSS color.

```tsx
<CloseIcon width={24} height={24} fill="var(--color-icon-on-light-primary)" aria-hidden />
```

Theme CSS exposes icon tokens such as `--color-icon-on-light-primary`, `--color-icon-on-dark-primary`, `--color-icon-brand-01`, `--color-icon-state-attention-on-light`, `--color-icon-state-disabled-on-light`, etc. Use the token that matches your context (light/dark background, brand, state).

**3. `color` prop (`IconColor`)** — Barrel icons accept the same short keys as typography (`brand-01`, `on-dark-secondary`, …), mapped to `var(--color-icon-*)`. Example:

```tsx
<SearchIcon color="brand-01" width={24} height={24} aria-hidden />
```

Do not confuse this with **`Button`’s** `color` prop (`neutral` | `brand` | `brand-accent`).

**4. `className` or `style`** — Apply a class or inline style that sets `fill` (or `color` if the SVG uses `currentColor` for fill).

```tsx
<SearchIcon className="my-icon-class" />
// .my-icon-class { fill: var(--color-icon-on-light-secondary); }
```

## Font Loading

Fonts are loaded automatically by `DesignSystemProvider`. For non-React (CSS-only) usage:

```tsx
import { loadBrandFonts } from '@minneapolisstartribune/design-system/web';
loadBrandFonts('startribune');
```

## Setup Checklist

- [ ] Import theme CSS: `@minneapolisstartribune/design-system/web/{brand}-{scheme}.css`
- [ ] Import component styles: `@minneapolisstartribune/design-system/web/components.css`
- [ ] Wrap with `<DesignSystemProvider brand="..." forceColorScheme="...">`
- [ ] Ensure `brand`/`forceColorScheme` props match the imported theme CSS file
- [ ] Import CSS **before** components render (top of entry file)

**Verify:** In DevTools, `getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary')` should return a value.

## Troubleshooting

See [Troubleshooting](troubleshooting.md#web-issues) for common web-specific issues.
