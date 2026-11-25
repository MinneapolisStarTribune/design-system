---
'@minneapolisstartribune/design-system': minor
---

Skeleton adds a `radius` prop, turns the shimmer off under `prefers-reduced-motion` (web and native), and uses the Figma placeholder gradient (`#e3e5e8` to `#f5f6f7`). Its web styles now have zero specificity, so `className` overrides size, radius and color without `!important`.
