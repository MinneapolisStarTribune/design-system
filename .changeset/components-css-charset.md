---
'@minneapolisstartribune/design-system': patch
---

`components.css` no longer starts with `@charset "UTF-8";`. The file is ASCII-only, so the rule did nothing, and when the file was imported into a cascade layer (`@import … layer(…)`) it caused an "Unknown at rule: @charset" parse warning.
