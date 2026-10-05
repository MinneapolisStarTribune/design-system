# Web Integration

Using the design system in web (React) applications.

## Dependencies

For **web** (using the `/web` entry), install the pinned peer versions (match the design system’s peerDependencies):

```bash
yarn add react@19.0.0 react-dom@19.0.0 @floating-ui/react@0.27.19
```

You do not need `react-native` or `@floating-ui/react-native`.

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

## Coachmark

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

For a Piano-driven coachmark (triggered by Piano's `setResponseVariable` event instead of your own state), see `@minneapolisstartribune/piano-coachmark` — a separate package, not part of this one, since design-system has no knowledge of or dependency on Piano.

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

## Drawer

`Drawer` is a web-only modal panel attached to a viewport edge. It's exported as a namespace: compose `Drawer.Root` with `Drawer.Heading`, `Drawer.Body` and an optional `Drawer.Footer`. `DrawerProps` types `Drawer.Root`.

```tsx
import { useState } from 'react';
import { Button, Drawer, type DrawerProps } from '@minneapolisstartribune/design-system/web';

function FilterDrawer({ position }: Pick<DrawerProps, 'position'>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Filter calendar</Button>

      <Drawer.Root open={open} onClose={() => setOpen(false)} position={position}>
        <Drawer.Heading>Filter Calendar</Drawer.Heading>
        <Drawer.Body>{/* filters */}</Drawer.Body>
        <Drawer.Footer>
          <Button color="brand" onClick={() => setOpen(false)}>
            Done
          </Button>
        </Drawer.Footer>
      </Drawer.Root>
    </>
  );
}
```

- The drawer is always controlled. The X icon button, Escape and overlay presses call `onClose(reason)` with `'closeButton' | 'escapeKey' | 'overlayPress'`; set `open` to `false` in response, or ignore a reason (e.g. overlay presses while a form has unsaved input).
- `role="alertdialog"` marks urgent interruptions and describes the drawer with its `Drawer.Body`; `describeWithBody` does the same for a regular drawer. `closeLabel` localizes the close button.
- Give it an accessible name: a `Drawer.Heading`, or `aria-label` when there's no visible title.
- It renders into `document.body`. Pass `portalRoot` to render into another element instead.
- Requires `components.css` (see [Quick Start](#quick-start)).

### Responsive props

`position` is a `Responsive<DrawerPosition>`: one edge (`'left' | 'right' | 'top' | 'bottom'`) for every screen size, or an object keyed by `Breakpoint` (`small`, `medium` 768px+, `large` 1160px+). Each key applies from that breakpoint up; sizes below the smallest key use the default, `{ small: 'bottom', medium: 'right' }`. An object needs at least one key.

```tsx
import type { Breakpoint, Responsive } from '@minneapolisstartribune/design-system/web';

<Drawer.Root position="left" {...rest} />                          // every size
<Drawer.Root position={{ small: 'bottom', large: 'left' }} {...rest} /> // bottom sheet until 1160px

const columns: Responsive<number> = { small: 1, medium: 2 };
const current: Breakpoint = 'large';
```

The breakpoint is read from the viewport on the client. During SSR the drawer resolves `small`, then updates after hydration.

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
