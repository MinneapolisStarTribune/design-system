---
'@minneapolisstartribune/design-system': patch
---

Add scoped web theme files: `startribune-light.scoped.css`, `startribune-dark.scoped.css`, `varsity-light.scoped.css`, and `varsity-dark.scoped.css`. Each contains only the scheme's CSS variables, under `[data-theme='light']` or `[data-theme='dark']`, and sets `color-scheme`. Import `{brand}-dark.scoped.css` after `{brand}-light.css` to switch to dark with `data-theme="dark"` on `<html>` or on any region. The existing `{brand}-{mode}.css` files are unchanged.
