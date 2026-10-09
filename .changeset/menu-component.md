---
'@minneapolisstartribune/design-system': minor
---

Add web `Menu`, with `Menu.Item`, `Menu.ItemIcon`, and `Menu.Divider`. The menu renders and wires a `trigger` element (with `onOpen`). It supports `placement`, pointer controls, link and disabled items (pass `as={NextLink}` to render a router link), item-closing behavior, and arrow-key navigation. `placement` and `arrowOffset` accept a value per breakpoint. Its `onClose` callback receives `escapeKey`, `outsidePress`, `focusOut`, `itemSelect`, or `triggerClick`. Pass `portalRoot` to render it outside `document.body`.

Exports the `MenuProps`, `MenuItemProps`, `MenuPlacement`, `MenuArrowOffset`, and `MenuCloseReason` types.
