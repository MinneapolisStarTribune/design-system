---
'@minneapolisstartribune/design-system': minor
---

`Menu.Root` takes a `lockScroll` prop. It defaults to `true`, so menus still stop the page from scrolling while open. Set it to `false` to let the page scroll; the menu follows its trigger.

`Select`'s listbox now slides back into view when its trigger is partly off screen, the same way `Menu` and `Popover` do.
