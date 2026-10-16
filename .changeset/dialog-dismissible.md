---
'@minneapolisstartribune/design-system': minor
---

`Dialog.Root` and `Drawer.Root` take a `dismissible` prop. Set it to `false` for prompts that can't be skipped, like signing in again after a session expires: Escape and overlay presses no longer call `onClose`, and the close button is hidden unless you pass `showCloseButton`.
