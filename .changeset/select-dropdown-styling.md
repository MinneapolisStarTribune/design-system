---
'@minneapolisstartribune/design-system': patch
---

`Select` now matches the Core `select` component. The options list uses the dropdown menu styles shared with `Menu`: 16px list radius, no vertical list padding, 12px option padding, 16px option text at every size, a 3px scrollbar, and a max height of 362px (was 280px), scrolling past that. The large trigger has a 12px gap before the chevron. Default and error borders use the `border-on-light-subtle-02` and `border-state-attention-on-light` tokens, so they follow dark mode. `Select` also no longer adds an `undefined` class to its container when a value is selected.
