---
'@minneapolisstartribune/design-system': minor
---

Add `Drawer` (web): a modal panel attached to the side of the screen. Compose `Drawer.Root` with `Drawer.Heading`, `Drawer.Body` and `Drawer.Footer`. Supports a responsive `position`, `role="alertdialog"`, describing the panel by its body (`describeWithBody`), a `closeLabel` for the close button, and an `onClose(reason)` that reports `'closeButton' | 'escapeKey' | 'overlayPress'`.
