---
'@minneapolisstartribune/design-system': patch
---

Fix `Coachmark` sitting dead-center instead of hugging the viewport edge near a corner-anchored trigger (e.g. a `top-right`/`bottom-right` coachmark on a nav icon), and its arrow sliding into the card's own rounded corner instead of staying inset from it.

`shift()` ran after the custom `alignmentShift` middleware and re-clamped the card's position using its own (larger) edge padding, silently overriding whatever edge-hugging position `alignmentShift` had computed. Both now share the same smaller padding. The `arrow()` middleware also now keeps a minimum distance from the card's edge instead of being allowed to slide flush into it.
