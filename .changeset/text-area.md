---
'@minneapolisstartribune/design-system': minor
---

Adds `FormControl.TextArea` (also exported as `TextArea`) on web for multi-line input. It takes `resizable` and `rows`, and picks up error/success state from `FormGroup.Caption`.

`TextInput` now shares its field styles with `TextArea`, which fixes a few focus states: the focus border now shows on filled or hovered fields, a focused error field keeps its red border, and keyboard focus is visible in Windows High Contrast mode.
