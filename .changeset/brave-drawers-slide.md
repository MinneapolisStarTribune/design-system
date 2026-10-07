---
'@minneapolisstartribune/design-system': minor
---

Add `Drawer` (web): a modal panel attached to the side of the screen. Compose `Drawer.Root` with `Drawer.Heading`, `Drawer.Body` and `Drawer.Footer`. Supports a responsive `position`, `role="alertdialog"`, describing the panel by its body (`describeWithBody`), a `closeLabel` for the close button, and an `onClose(reason)` that reports `'closeButton' | 'escapeKey' | 'overlayPress'`.
`Drawer.Heading` renders an `h2` by default; pass `as` (`'h1' | 'h2' | 'h3' | 'h4' | 'div'`) to change the heading level, or `div` for content that isn't a single heading. Its props are exported as `DrawerHeadingProps`.
