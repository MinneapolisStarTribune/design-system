---
'@minneapolisstartribune/design-system': patch
---

`Popover` now shrinks to fit narrow screens or its `portalRoot`. A `left` or `right` popover that fits on neither side opens below or above the trigger instead. `Popover.Divider` now applies `fullBleed`: by default it spans the popover edge to edge, and with `fullBleed={false}` it lines up with the body text. The divider also has `role="separator"`.
