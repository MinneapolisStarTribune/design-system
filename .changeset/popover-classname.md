---
'@minneapolisstartribune/design-system': major
---

Simplify `Popover` props. `wrapperClassName`, `containerClassName`, `contentClassName`, and `arrowClassName` are replaced by a single `className` on the popover surface. Of the HTML div attributes, only `id` and `style` are still accepted.

**Breaking for Popover consumers.** Move custom classes to `className`, and style inner layers from that class.
