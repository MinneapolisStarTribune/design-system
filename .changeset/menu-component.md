---
'@minneapolisstartribune/design-system': major
---

Add web `Menu`, with `Menu.Item`, `Menu.ItemIcon`, and `Menu.Divider`. The menu opens against an `anchorEl`, supports MUI-style origins, pointer controls, link and disabled items, item-closing behavior, and arrow-key navigation. Its `onClose` callback receives `escapeKey`, `outsidePress`, `focusOut`, or `itemSelect`.

**Breaking:** Simplify `Popover` styling props. Replace `wrapperClassName`, `containerClassName`, `contentClassName`, and `arrowClassName` with `className` on the popover surface. Only `id` and `style` remain supported HTML div attributes. Custom `style` is now merged with positioning styles, so it no longer breaks placement.

Varsity Web uses `Popover` for article sharing and gifting. It does not use the removed styling props.
Star Tribune Web does not use the design-system `Popover`.
Coaches Portal uses the removed `wrapperClassName`, `containerClassName`, and `contentClassName` props for its sidebar season filter.

`Popover` and `TriggerablePopover` fix: the dialog is now named by `Popover.Heading` when one is rendered, and by `aria-label` only when there is no heading. Before, `aria-labelledby` pointed to an ID that no element had.

`Popover.Heading` adds `eyebrow` (a label above the title), `value` (content at the end of the title row) and `showCloseButton` (defaults to `true`).
