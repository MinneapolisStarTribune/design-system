# Web Integration

Using the design system in web (React) applications.

## Dependencies

For **web** (using the `/web` entry), install the pinned peer versions (match the design system’s peerDependencies):

```bash
yarn add react@19.0.0 react-dom@19.0.0 @floating-ui/react@0.27.19
```

You do not need `react-native` or `@floating-ui/react-native`.

### Overlay portal root (optional)

By default, `Popover`, `Menu`, and `Drawer` render their content into `document.body`. Pass `portalRoot` to render into another element instead, for example when:

- The overlay lives inside a **modal** or **sidebar** and should be clipped or stacked with that container
- You use **Storybook** and want the overlay to stay within the story frame
- You need a **custom container** for styling or layout (e.g. a dedicated overlay layer)

Keep the element in state with a ref callback, so the overlay re-renders once the element exists:

```tsx
import { useState } from 'react';
import { Popover, Button } from '@minneapolisstartribune/design-system/web';

function SidebarWithPopover() {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  return (
    <aside ref={setPortalRoot} className="my-sidebar" style={{ overflow: 'hidden' }}>
      <Popover.Root trigger={<Button>Options</Button>} portalRoot={portalRoot} aria-label="Options">
        <p>This content renders inside the sidebar, not document.body.</p>
      </Popover.Root>
    </aside>
  );
}
```

Pass `portalRoot` to each overlay that needs it. There is no provider that sets it for a whole subtree.

### Menu

`Menu` is controlled. Pass a `trigger` element and keep `open` in state: the menu adds the trigger's click handler, ref, and ARIA attributes, calls `onOpen` when the trigger is clicked, and calls `onClose` with the reason (`escapeKey`, `outsidePress`, `focusOut`, `itemSelect`, `triggerClick`).

```tsx
import { useState } from 'react';
import { Button, Menu } from '@minneapolisstartribune/design-system/web';

function AccountMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Menu.Root
      trigger={<Button>Account</Button>}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      aria-label="Account"
    >
      <Menu.Item href="/profile">Manage Profile</Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={logOut}>Log Out</Menu.Item>
    </Menu.Root>
  );
}
```

When the menu can't render its trigger (for example, one menu shared by several anchors), pass `anchorEl` instead of `trigger` and `onOpen`, and add `aria-haspopup="menu"` and `aria-expanded` to your anchor yourself.

Position the menu with `anchorOrigin` and `transformOrigin` (default: below the anchor, left edges aligned). Both, and `arrowOffset`, accept a value per breakpoint. Set `--menu-width`, `--menu-max-height`, and `--menu-item-min-height` on `className` to change the default sizes.

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

Two more props cover less common cases:

- `trackReferenceMovement` (defaults to `false`) — repositions on every animation frame instead of only on scroll/resize. Turn this on only when `children` itself scrolls within the page (e.g. a table row), not just when the page around it scrolls — a reference that's continuously moving under normal event-based repositioning can visibly lag behind it. It costs a continuous `requestAnimationFrame` loop for as long as the coachmark is open, so leave it off for a reference that stays fixed on screen (e.g. a sticky header icon).
- `impressionTrackingId` — renders an empty, inert element with this id inside the floating panel, sized/positioned to exactly cover it, for a third party (e.g. Piano) that tracks impressions by watching whether _its own_ injected element intersects the viewport. Omit it unless something external actually needs to observe the coachmark's real on-screen visibility this way.

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

## Dialog

`Dialog` is a web-only modal window: centered from 768px up, a bottom sheet below. It's exported as a namespace: compose `Dialog.Root` with `Dialog.Title`, `Dialog.Content` and an optional `Dialog.Actions`. `DialogProps` types `Dialog.Root`, `DialogTitleProps` types `Dialog.Title`, `DialogSectionProps` types `Dialog.Content`, and `DialogActionsProps` types `Dialog.Actions`.

```tsx
import { useState } from 'react';
import { Button, Dialog } from '@minneapolisstartribune/design-system/web';

function DeleteGameDialog({ onDelete }: { onDelete: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete game</Button>

      <Dialog.Root open={open} onClose={() => setOpen(false)}>
        <Dialog.Title>Delete game?</Dialog.Title>
        <Dialog.Content>Are you sure you want to delete?</Dialog.Content>
        <Dialog.Actions>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="error" onClick={onDelete}>
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog.Root>
    </>
  );
}
```

- The dialog is always controlled. The X icon button, Escape and overlay presses call `onClose`; set `open` to `false` in response. Focus returns to the opening control on close.
- Give it an accessible name: a `Dialog.Title`, or `aria-label` when there's no visible title. `Dialog.Title` renders an `h2`; pass `as` (`'h1' | 'h2' | 'h3' | 'h4' | 'div'`) to match the page's heading outline, or `as="div"` to wrap more than a heading, like a logo plus a title. Its whole text becomes the accessible name, so give decorative images an empty `alt` and keep subtitles and badges outside it.
- For destructive or urgent confirmations, pass `role="alertdialog"` and point `initialFocus` at Cancel. Use `color="error"` on the destructive button. An `alertdialog` is described by its `Dialog.Content`; add `describeWithContent` to describe a regular dialog holding a short message.
- At 767px and below, `Dialog.Actions` stacks its actions full width, the usual pattern for confirmations. For forms and longer content, pass `stackOnMobile={false}` to keep them side by side. It has no effect from 768px up.
- `onClose(reason)` reports `'closeButton' | 'escapeKey' | 'overlayPress'`. Ignore `'overlayPress'` when a form has unsaved input.
- It shares Drawer's `showCloseButton`, `closeLabel`, `initialFocus` and `portalRoot` props, and behaves the same way: both are built on one internal modal base.
- The switch between sheet and centered dialog is read from the viewport on the client, like Drawer's `position`. During SSR it resolves the bottom sheet, then updates after hydration.
- Requires `components.css` (see [Quick Start](#quick-start)).

## Drawer

`Drawer` is a web-only modal panel attached to a viewport edge. It's exported as a namespace: compose `Drawer.Root` with `Drawer.Heading`, `Drawer.Body` and an optional `Drawer.Footer`. `DrawerProps` types `Drawer.Root`, `DrawerHeadingProps` types `Drawer.Heading`, and `DrawerSectionProps` types `Drawer.Body` and `Drawer.Footer`.

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
- Give it an accessible name: a `Drawer.Heading`, or `aria-label` when there's no visible title. `Drawer.Heading` takes the same `as` prop as `Dialog.Title`.
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

## ToggleGroup

`ToggleGroup` is a web-only set of joined toggles (the Figma **segmented control**). It's exported as a namespace: compose `ToggleGroup.Root` with `ToggleGroup.Item`. `ToggleGroupProps` types `ToggleGroup.Root`, `ToggleGroupItemProps` types `ToggleGroup.Item`, and `ToggleGroupDetailProps` types `ToggleGroup.Detail`.

```tsx
import { useState } from 'react';
import { ToggleGroup } from '@minneapolisstartribune/design-system/web';

function GameFilter() {
  const [filter, setFilter] = useState('all');

  return (
    <ToggleGroup.Root label="Filter games" value={filter} onChange={setFilter}>
      <ToggleGroup.Item value="all">All Games</ToggleGroup.Item>
      <ToggleGroup.Item value="past">Past</ToggleGroup.Item>
      <ToggleGroup.Item value="upcoming">Upcoming</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}
```

- It's always controlled. `type="single"` (default) keeps exactly one item selected and renders native radios; `type="multiple"` renders checkboxes and takes `value` as an array.
- Give the group an accessible name: `label`, or `aria-labelledby` pointing at a visible heading. Icon-only items need `aria-label`; in development an item with no text and no `aria-label` logs a warning.
- Selected items use the brand filled Button fill; the color isn't configurable. Wrap secondary item content (e.g. a count) in `ToggleGroup.Detail`, which is smaller and dims to suit the selected fill.
- `size` (`small`, `medium` (default), `large`) matches the Button heights and padding.
- Also supports `fullWidth` and `disabled` on the group or a single item.

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

Typography components (headings, body copy, labels, quotes, etc.) accept a `color` prop typed as **`TextColor`**: short keys such as `brand-01`, `on-light-primary`, and `state-attention-on-dark` that resolve to `var(--color-text-*)`. This is **not** the same as **`Button`’s** `color` prop, which uses module variants `neutral`, `brand`, `brand-accent`, and `error` (for destructive actions such as Delete) for button styles.

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

Do not confuse this with **`Button`’s** `color` prop (`neutral` | `brand` | `brand-accent` | `error`).

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
