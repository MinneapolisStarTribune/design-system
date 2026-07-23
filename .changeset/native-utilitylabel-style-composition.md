---
"@minneapolisstartribune/design-system": patch
---

Native UtilityLabel: a caller-supplied `style` prop now composes after the generated typography style instead of replacing it, so typography tokens are preserved while caller overrides still apply. (#394)
