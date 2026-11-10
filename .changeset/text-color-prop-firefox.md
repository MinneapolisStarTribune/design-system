---
'@minneapolisstartribune/design-system': patch
---

Fix the typography `color` prop being ignored in Firefox and Safari on client renders. The prop now sets `--ds-text-color` inline and the theme CSS applies it with `!important`, since React can't set `!important` inline.
