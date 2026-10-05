---
'@minneapolisstartribune/design-system': major
---

**Breaking:** Simplify `Popover` styling props. Replace `wrapperClassName`, `containerClassName`, `contentClassName`, and `arrowClassName` with `className` on the popover surface. Only `id` and `style` remain supported HTML div attributes. Custom `style` is now merged with positioning styles, so it no longer breaks placement.

**Breaking:** `TriggerablePopover` now shares `Popover`'s surface and props. Replace `wrapperClassName`, `containerClassName`, `contentClassName`, and `arrowClassName` with `className`. Only `id` and `style` remain supported HTML div attributes, and `style` is merged with positioning styles.

**Breaking:** Remove `PopoverPortalRootProvider` and `PopoverPortalRootContext`. Pass `portalRoot` to each `Popover` or `TriggerablePopover` that needs a different container, the same way `Drawer` does.

Varsity Web uses `Popover` for article sharing and gifting. It does not use the removed styling props.
Star Tribune Web does not use the design-system `Popover`.
Coaches Portal uses the removed `wrapperClassName`, `containerClassName`, and `contentClassName` props for its sidebar season filter.

`Popover` and `TriggerablePopover` fix: they no longer wrap their trigger in an extra `div`. The `div` caused hydration errors inside `<p>` and broke inline, flex and grid layouts.

`Popover` and `TriggerablePopover` fix: the dialog is now named by `Popover.Heading` when one is rendered, and by `aria-label` only when there is no heading. Before, `aria-labelledby` pointed to an ID that no element had.

`Popover.Heading` adds `eyebrow` (a label above the title), `value` (content at the end of the title row) and `showCloseButton` (defaults to `true`).

`Popover` and `TriggerablePopover` fix: the trigger's `aria-controls` now points to the dialog. Before, the dialog had no `id` unless one was passed. The popover also no longer sets an inline `display` on an element trigger, so a `Button` trigger keeps its own layout.

`Popover` and `TriggerablePopover` fix: the popover follows the app theme, like `Modal` and `Coachmark`. It uses the semantic surface, text and border tokens instead of pinning light values, so in dark mode it has a dark surface with light text. Before, the close button was white on a white surface. The `--popover-background-dark`, `--popover-border-color-dark` and `--popover-arrow-fill-dark` overrides are removed. Set `--popover-background`, `--popover-arrow-fill` and `--popover-arrow-stroke` to customize the surface.

`TriggerablePopover` fix: content injected after an external open now shows when the popover was opened by a click first. Before, the injection slot stayed hidden.
