---
'@minneapolisstartribune/design-system': minor
---

Add web `Menu`, with `Menu.Item`, `Menu.ItemIcon`, and `Menu.Divider`. The menu needs an `aria-label` or `aria-labelledby`. It renders and wires a `trigger` element. It supports `placement`, `hideArrow`, `arrowOffset`, link and disabled items (pass `as={NextLink}` to render a router link), `closeOnSelect` on items, and arrow-key navigation. `placement` and `arrowOffset` accept a value per breakpoint. Pass `open` and `onOpenChange` to control it; without them it manages its own open state. Pass `portalRoot` to render it outside `document.body`.

Popover now shrinks to fit narrow screens, and a side placement with no room on either side falls back to below or above the trigger.

Exports the `MenuProps`, `MenuItemProps`, `MenuItemIconProps`, `MenuDividerProps`, `MenuPlacement`, and `MenuArrowOffset` types.

Planned follow-up, not in this release: Tooltip can move onto the popup layer that Popover, Menu, and `Coachmark` share, and an overflow boundary option separate from `portalRoot` will let a custom portal container stop limiting where a surface flips and shifts.
