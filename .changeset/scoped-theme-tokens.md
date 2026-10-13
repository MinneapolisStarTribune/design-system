---
'@minneapolisstartribune/design-system': minor
---

Add scoped web theme files: `startribune-light.scoped.css`, `startribune-dark.scoped.css`, `varsity-light.scoped.css`, and `varsity-dark.scoped.css`. Each contains only the scheme's CSS variables, under `[data-theme='light']` or `[data-theme='dark']`, and sets `color-scheme`. Import `{brand}-dark.scoped.css` after `{brand}-light.css` to switch to dark with `data-theme="dark"` on `<html>` or on any region. The existing `{brand}-{mode}.css` files are unchanged.

`DesignSystemProvider` now sets `data-theme` on `<html>` when `forceColorScheme` is passed, and restores the previous value on unmount. When `forceColorScheme` is omitted, the provider leaves `data-theme` alone. Apps that pass `forceColorScheme="dark"` now also get the `[data-theme='dark']` styles in `TextInput` and `CandyBar` (the same styles dark Storybook shows). `Link` now applies its dark styles under `[data-theme='dark']` as well as `.sb-dark`. The new `DS_ROOT_THEME_ATTRIBUTE` export holds the attribute name.
