---
'@minneapolisstartribune/design-system': minor
---

Add `Menu` for web, with `Menu.Item`, `Menu.ItemIcon`, and `Menu.Divider`. The menu opens against an `anchorEl` and is positioned with `anchorOrigin`/`transformOrigin` or `placement`; `arrowOffset` and `hideArrow` control the pointer. It supports link items, disabled items, `closeOnSelect`, and arrow-key navigation. Defaults match Core Components (360px surface, 43px rows, 362px max height); `surfaceWidth`, `itemMinHeight`, and `maxHeight` override them.

`Popover` fix: a `style` prop is now merged with the positioning styles instead of replacing them, so passing `style` no longer breaks placement.
