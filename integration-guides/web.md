# Web Integration

Using the design system in web (React) applications.

## Dependencies

For **web** (using the `/web` entry), install the pinned peer versions (match the design system’s peerDependencies):

```bash
yarn add react@19.0.0 react-dom@19.0.0 @floating-ui/react@0.27.19
```

You do not need `react-native` or `@floating-ui/react-native`.

### Overlay portal root (optional)

By default, `Popover`, `Menu`, and `Select` render into the nearest dialog or `data-theme` region around their trigger, so they stay inside focus traps and scoped themes, and fall back to `document.body` when there is none. `Drawer` always renders into `document.body`. Pass `portalRoot` to `Popover`, `Menu`, or `Drawer` to render into another element instead, for example when:

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

## Datepicker

`Datepicker` renders inline without `trigger`, or opens a nonmodal calendar popover from a
focusable trigger. Date props and `onChange` use plain `string` values in zero-padded `YYYY-MM-DD`
format rather than timestamps. Both bounds are inclusive. `value={null}` is controlled; omit
`value` to use `defaultValue` and internal state.

```tsx
import { useState } from 'react';
import { Datepicker, UtilityButton } from '@minneapolisstartribune/design-system/web';

function EventDate() {
  const [date, setDate] = useState<string | null>(null);
  return (
    <Datepicker
      value={date}
      onChange={setDate}
      label="Choose event date"
      min="2026-03-01"
      max="2026-06-30"
      trigger={<UtilityButton label={date ?? 'Choose date'} />}
    />
  );
}
```

The trigger must forward its ref, handlers, and ARIA props to a focusable element. Its accessible
name stays intact; `label` is appended to its description. Selection or Escape returns focus to
the trigger. Tabbing or clicking outside dismisses without stealing focus from the destination.
Portals automatically respect the surrounding dialog and theme scope.

Malformed dates are treated as empty and malformed bounds as absent. Inverted bounds disable all
dates. Changing bounds never changes a controlled value; navigation is clamped to available dates.
Years 0001–9999 are supported. Display labels use English and weeks start on Sunday.

The consumer owns its Today action. The text input wrapper and TanStack Form adapter are
deliberately deferred to VAR-1335; this calendar does not add them to `FormControl`.

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

Each theme file sets its CSS variables on `:root` and includes the brand's typography classes. Import one per page.

Each scheme also ships as a scoped file that only contains the CSS variables, under a `data-theme` selector:

| Brand        | Light                          | Dark                          |
| ------------ | ------------------------------ | ----------------------------- |
| Star Tribune | `startribune-light.scoped.css` | `startribune-dark.scoped.css` |
| Varsity      | `varsity-light.scoped.css`     | `varsity-dark.scoped.css`     |

### Static Loading

Import the theme CSS file at the top of your entry file (shown above).

### Switching Themes with `data-theme`

To switch schemes at runtime, keep the light theme file and add the scoped dark file. The dark variables apply to any element with `data-theme="dark"` and its descendants, and they set `color-scheme: dark`. This is the same attribute `components.css` uses for its dark component styles.

```tsx
import '@minneapolisstartribune/design-system/web/components.css';
import '@minneapolisstartribune/design-system/web/startribune-light.css';
import '@minneapolisstartribune/design-system/web/startribune-dark.scoped.css';
```

```html
<!-- Whole page -->
<html data-theme="dark">
  …
</html>

<!-- One region -->
<section data-theme="dark">…</section>
```

To show a light region inside a dark page, also import `{brand}-light.scoped.css` and set `data-theme="light"` on that region. Known limitation: `TextInput`, `TextArea`, `CandyBar`, and `Link` apply their dark styles when any ancestor has `data-theme="dark"`, so they keep those styles inside a light region nested in a dark page. Import the scoped files after the theme file. If you use cascade layers, put them in the same layer as the theme file or a later one.

When you pass `forceColorScheme`, `DesignSystemProvider` sets `data-theme` on `<html>` to match, and restores the previous value when it unmounts. Leave `forceColorScheme` out to manage `data-theme` on `<html>` yourself; components that read the scheme from context then treat it as `light`. The attribute name is exported as `DS_ROOT_THEME_ATTRIBUTE` (and the brand attribute, `data-ds-brand`, as `DS_ROOT_BRAND_ATTRIBUTE`).

```tsx
<DesignSystemProvider brand="startribune" forceColorScheme={theme}>
```

The provider sets the attribute after hydration. To avoid a flash of the wrong theme in server-rendered apps, also render `data-theme` on `<html>` in the server HTML, or set it with a small inline script in `<head>`.

`surface="dark"` and `surface="light"` work the same in either scheme: dark-surface styles use the `on-dark` tokens, which have the same values in light and dark themes.

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
- For prompts that can't be skipped, like signing in again after a session expires, pass `dismissible={false}` (default `true`). Escape and overlay presses no longer call `onClose`, and the close button is hidden unless you pass `showCloseButton`. The dialog closes only when you set `open` to `false`, so always give it an action that moves the user forward.
- It shares Drawer's `dismissible`, `showCloseButton`, `closeLabel`, `initialFocus` and `portalRoot` props, and behaves the same way: both are built on one internal modal base.
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

- The drawer is always controlled. The X icon button, Escape and overlay presses call `onClose(reason)` with `'closeButton' | 'escapeKey' | 'overlayPress'`; set `open` to `false` in response, or ignore a reason (e.g. overlay presses while a form has unsaved input). Pass `dismissible={false}` (default `true`) to stop Escape and overlay presses from calling `onClose` and hide the close button; pass `showCloseButton` to keep it.
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

## Menu

`Menu` is controlled. Pass a `trigger` element and keep `open` in state: the menu adds the trigger's click handler, ref, and ARIA attributes, calls `onOpen` when the trigger is clicked, and calls `onClose` when the menu requests to close.

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

Position the menu with `placement` (default: `'bottom-start'`, below the anchor with left edges aligned). `placement` and `arrowPosition` accept a value per breakpoint. Set `--menu-width`, `--menu-max-height`, and `--menu-item-min-height` on `className` to change the default sizes.

An open menu stops the page from scrolling (`lockScroll`, default `true`). Scrollable areas inside the page still scroll. Pass `lockScroll={false}` to let the page scroll while the menu stays attached to its trigger:

```tsx
<Menu.Root lockScroll={false} trigger={<Button>Account</Button>} /* ... */>
```

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

## TextArea

`FormControl.TextArea` (also exported as `TextArea`) is a web-only multi-line field. Put it in a `FormGroup` and it picks up the label, description and caption wiring, and error/success state from a `FormGroup.Caption` variant, same as `FormControl.TextInput`.

```tsx
<FormGroup>
  <FormGroup.Label optional>Comment</FormGroup.Label>
  <FormControl.TextArea
    name="comment"
    placeholderText="Write a comment..."
    maxLength={200}
    value={comment}
    onChange={(e) => setComment(e.target.value)}
  />
  <FormGroup.Caption variant="info">{`${comment.length}/200 characters`}</FormGroup.Caption>
</FormGroup>
```

- `rows` (default `2`) sets the visible lines; `resizable` (default `true`) lets users drag the height.
- Only the native attributes listed on `TextAreaProps` are passed through (`name`, `maxLength`, `required`, `readOnly`, `autoComplete`, etc). `ref` goes to the `<textarea>`.
- Outside a `FormGroup`, pass `aria-label` or `aria-labelledby`.
- With TanStack Form, use `TextAreaField` from the [tanstack-form package](#tanstack-form).

## TanStack Form

If your forms use [TanStack Form](https://tanstack.com/form), `@minneapolisstartribune/design-system-tanstack-form` has field adapters (`TextField`, `SelectField`, `CheckboxField`, etc.) that wire the form controls' value, blur, errors and ARIA to a TanStack field. See its [README](../packages/tanstack-form/README.md) for setup and usage.

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
- [ ] (Theme switching) Import `{brand}-dark.scoped.css` after the theme file
- [ ] Wrap with `<DesignSystemProvider brand="..." forceColorScheme="...">`
- [ ] Ensure `brand`/`forceColorScheme` props match the imported theme CSS file
- [ ] Import CSS **before** components render (top of entry file)

**Verify:** In DevTools, `getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary')` should return a value.

## Troubleshooting

See [Troubleshooting](troubleshooting.md#web-issues) for common web-specific issues.
