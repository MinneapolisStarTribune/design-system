---
'@minneapolisstartribune/design-system': minor
---

Add web `Menu`, with `Menu.Item`, `Menu.ItemIcon`, and `Menu.Divider`. The menu needs an `aria-label` or `aria-labelledby`. It renders and wires a `trigger` element (with `onOpen`). It supports `placement`, `hideArrow`, `arrowOffset`, link and disabled items (pass `as={NextLink}` to render a router link), `closeOnSelect` on items, and arrow-key navigation. `placement` and `arrowOffset` accept a value per breakpoint. Its `onClose` callback takes no arguments. Pass `portalRoot` to render it outside `document.body`.

Also splits `FloatingTrigger` out of Popover's `FloatingSurface`. Popover now shrinks to fit narrow screens, and a side placement with no room on either side falls back to below or above the trigger.

Exports the `MenuProps`, `MenuItemProps`, `MenuItemIconProps`, `MenuDividerProps`, `MenuPlacement`, and `MenuArrowOffset` types.

Planned follow-up, not in this release: Popover, Menu, Tooltip, and `Coachmark` can share one positioning layer (placement, middleware, arrow, and portal), and each component will keep its own open, dismiss, and ARIA behavior. Popover and Menu will keep sharing `FloatingTrigger`. The follow-up adds an overflow boundary option separate from `portalRoot`, so a custom portal container no longer limits where a surface flips and shifts. `Coachmark`'s `position` prop will become `placement`.
