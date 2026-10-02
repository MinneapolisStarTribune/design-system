---
'@minneapolisstartribune/design-system': minor
---

Add `Menu` for web, with `Menu.Item`, `Menu.ItemIcon`, and `Menu.Divider`. The menu opens against an `anchorEl` and is positioned with MUI-style `anchorOrigin`/`transformOrigin`; `arrowOffset` and `hideArrow` control the pointer. `onClose` receives a reason (`escapeKey`, `outsidePress`, `focusOut`, `itemSelect`), and every part takes a `dataTestId`. It supports link items, disabled items, per-item `closeOnSelect`, and arrow-key navigation, and locks page scroll while open. Defaults match Core Components (360px surface, 43px rows, 362px max height); `--menu-width`, `--menu-item-min-height`, and `--menu-max-height` override them through `className`.

`Popover` fix: a `style` prop is now merged with the positioning styles instead of replacing them, so passing `style` no longer breaks placement.
