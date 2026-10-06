---
'@minneapolisstartribune/design-system': major
---

## Breaking changes

### Namespace API

`Popover` and `TriggerablePopover` now follow the `Drawer` and `Menu` namespace pattern:

```tsx
// Before
<Popover />
<TriggerablePopover />

// After
<Popover.Root />
<TriggerablePopover.Root />
```

Imports and section names do not change: use `Popover.Heading`, `Popover.Description`,
`Popover.Body`, and `Popover.Divider` (and the corresponding `TriggerablePopover` sections).

### Styling API

- On `Popover` and `TriggerablePopover`, replace `wrapperClassName`, `containerClassName`,
  `contentClassName`, and `arrowClassName` with surface `className`.
- On sections, replace named class props with `className`:
  - `Popover.Heading`: replace `headerClassName`; `titleClassName` and `closeButtonClassName`
    are removed.
  - `Popover.Description`, `Popover.Body`, and `Popover.Divider`: replace their named class prop.
- Only `id` and `style` remain supported HTML div attributes. Use `dataTestId` instead of
  `data-testid`, as with `Drawer`. Custom `style` is merged with positioning styles, so it no
  longer breaks placement.
- Sections also accept `dataTestId`. `Popover.Heading` sets `${dataTestId}-close-button` on its
  close button.

### Portal API

`PopoverPortalRootProvider` and `PopoverPortalRootContext` are removed. Pass `portalRoot` to
each `Popover` or `TriggerablePopover` that needs a custom container, as with `Drawer`.

## Consumer impact

- **Coaches Portal** (`apps/web`, 2.1.0): update both `Sidebar.tsx` popovers to
  `Popover.Root` and replace removed styling props with `className`. The account menu can
  alternatively move to `Menu` (VAR-1267). It does not use the removed portal API.
- **Varsity Web** (1.14.0): in `GiftButton` and `ShareButton`, rename `<Popover>` to
  `<Popover.Root>`. No removed props or portal API are used.
- **Star Tribune Web** (1.17.0) and **The Brief** (^1.12.1): no action required.

Coaches Portal and Varsity Web force a light color scheme, so the dark-mode improvement below
does not change their appearance.

## Improvements

- `Popover` and `TriggerablePopover` no longer add a trigger wrapper `div`, avoiding hydration
  errors inside `<p>` and preserving inline, flex, and grid layouts.
- Dialogs use `Popover.Heading` as their accessible name when present, otherwise `aria-label`.
- Triggers now point `aria-controls` at the dialog, and element triggers keep their own display.
- `Popover.Heading` adds `eyebrow`, `value`, and `showCloseButton` (default: `true`).
- Popovers now follow the app theme. Customize the surface with `--popover-background`,
  `--popover-arrow-fill`, and `--popover-arrow-stroke`.
- `TriggerablePopover` now reveals externally injected content after a click-open and close.
