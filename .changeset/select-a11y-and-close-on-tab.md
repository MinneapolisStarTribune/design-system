---
'@minneapolisstartribune/design-system': patch
---

`Select` and `MultiSelect` stay inside their container with `box-sizing: border-box`, update their dropdowns padding and item radius.

`Select` has one tab stop. The nested button is now a plain element, so screen readers no longer announce the field twice. The combobox opens and selects with Space, exposes `aria-disabled` when disabled, and leaves the tab order.

`Select` now selects the active option and closes on Tab, and closes when focus moves to another control.
