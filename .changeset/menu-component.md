---
'@minneapolisstartribune/design-system': major
---

Add web `Menu`, with `Menu.Item`, `Menu.ItemIcon`, and `Menu.Divider`. The menu opens against an `anchorEl`, supports MUI-style origins, pointer controls, link and disabled items, item-closing behavior, and arrow-key navigation. Its `onClose` callback receives `escapeKey`, `outsidePress`, `focusOut`, or `itemSelect`.

**Breaking:** Simplify `Popover` styling props. Replace `wrapperClassName`, `containerClassName`, `contentClassName`, and `arrowClassName` with `className` on the popover surface. Only `id` and `style` remain supported HTML div attributes. Custom `style` is now merged with positioning styles, so it no longer breaks placement.

No in-repository consumers use the removed Popover styling props.

`Popover` and `TriggerablePopover` fix: when no `aria-label` is passed, the dialog is now named by `Popover.Heading`. Before, `aria-labelledby` pointed to an ID that no element had.
