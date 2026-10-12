---
'@minneapolisstartribune/design-system': minor
---

Add web `Menu`, with `Menu.Item`, `Menu.ItemIcon`, and `Menu.Divider`. The menu renders and wires a `trigger` element (with `onOpen`). It supports `placement`, pointer controls, link and disabled items (pass `as={NextLink}` to render a router link), item-closing behavior, and arrow-key navigation. `placement` and `arrowPosition` accept a value per breakpoint. Its `onClose` callback takes no arguments. If the chosen side runs out of room, the menu flips to the other side, then shrinks to fit and scrolls. Pass `portalRoot` to render it outside `document.body`.

Exports the `MenuProps`, `MenuItemProps`, `MenuPlacement`, and `MenuArrowPosition` types.
