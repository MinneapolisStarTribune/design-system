---
'@minneapolisstartribune/design-system': minor
---

Skeleton now takes its shimmer colors from the `color.background.light-gray-02` and `light-gray-01` tokens, so it follows the app theme in light and dark mode. A new `surface` prop (`light` or `dark`) keeps the same colors in every theme, for a skeleton on a surface that differs from the theme. It also adds a `radius` prop, turns the shimmer off under `prefers-reduced-motion` (web and native), and updates the gradient angles to the Core Components design. Web styles have zero specificity, so a `className` overrides size, radius and color without `!important`.
