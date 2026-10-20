---
'@minneapolisstartribune/design-system': minor
---

`Menu.Root` takes a `lockScroll` prop. It defaults to `true`, so menus still stop the page from scrolling while open. Set it to `false` to let the page scroll; the menu follows its trigger.

`Menu`, `Popover`, and `Select` now render inside the nearest dialog or `data-theme` region instead of always at the end of `body`. They open above `Dialog` and `Drawer`, stay interactive in native and third-party dialogs, and keep a scoped theme. They now position with `position: fixed`.

`Select`'s listbox now slides back into view when its trigger is partly off screen, the same way `Menu` and `Popover` do. Moving through options scrolls only the list, never the page or a scrolling container.
