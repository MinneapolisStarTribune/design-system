---
'@minneapolisstartribune/design-system': major
---

**Breaking:** Simplify `Popover` styling props. Replace `wrapperClassName`, `containerClassName`, `contentClassName`, and `arrowClassName` with `className` on the popover surface. Only `id` and `style` remain supported HTML div attributes. Custom `style` is now merged with positioning styles, so it no longer breaks placement.

**Breaking:** `TriggerablePopover` now shares `Popover`'s surface and props. Replace `wrapperClassName`, `containerClassName`, `contentClassName`, and `arrowClassName` with `className`. Only `id` and `style` remain supported HTML div attributes, and `style` is merged with positioning styles.

Varsity Web uses `Popover` for article sharing and gifting. It does not use the removed styling props.
Star Tribune Web does not use the design-system `Popover`.
Coaches Portal uses the removed `wrapperClassName`, `containerClassName`, and `contentClassName` props for its sidebar season filter.

`Popover` and `TriggerablePopover` fix: they no longer wrap their trigger in an extra `div`. The `div` caused hydration errors inside `<p>` and broke inline, flex and grid layouts. `PopoverPortalRootProvider` and `PopoverPortalRootContext` still work for setting the portal root of popovers below them.

`Popover` and `TriggerablePopover` fix: the dialog is now named by `Popover.Heading` when one is rendered, and by `aria-label` only when there is no heading. Before, `aria-labelledby` pointed to an ID that no element had.

`Popover.Heading` adds `eyebrow` (a label above the title), `value` (content at the end of the title row) and `showCloseButton` (defaults to `true`).
