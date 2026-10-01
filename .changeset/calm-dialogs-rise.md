---
'@minneapolisstartribune/design-system': minor
---

Add `Dialog` (web): a modal window that's centered on larger screens and rises from the bottom as a sheet on phones. Compose `Dialog.Root` with `Dialog.Title`, `Dialog.Content` and `Dialog.Actions`. `Dialog` and `Drawer` both support `role="alertdialog"`, describing the panel by its content (`describeWithContent` / `describeWithBody`), a `closeLabel` for the close button, and an `onClose(reason)` that reports `'closeButton' | 'escapeKey' | 'overlayPress'`.
