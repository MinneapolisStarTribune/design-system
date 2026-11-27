---
'@minneapolisstartribune/design-system': minor
---

Skeleton colors now follow the app theme. Adds `surface` (`light` or `dark`) and `radius` props, turns the shimmer off under `prefers-reduced-motion` (web and native), and updates the gradient angles. An unlayered `className` overrides size, radius and color without `!important`. Classes in a cascade layer lose to it unless `components.css` is imported into an earlier layer.
