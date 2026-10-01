---
'@minneapolisstartribune/design-system': minor
---

Add `Menu` for web, with `Menu.Item`, `Menu.ItemIcon`, and `Menu.Divider`. The menu opens against an `anchorEl` and is positioned with `anchorOrigin`/`transformOrigin` or `placement`; `arrowOffset` and `hideArrow` control the pointer. It supports link items, disabled items, `closeOnSelect`, and arrow-key navigation. Defaults match Core Components (360px surface, 43px rows, 362px max height); `surfaceWidth`, `itemMinHeight`, and `maxHeight` override them.

`Popover` now supports an anchored mode: pass `anchorEl` and `open` instead of `trigger`. It also accepts aligned placements (for example `bottom-start`), `role`, `hideArrow`, `arrowStaticOffset`, `arrowSize`, `arrowPadding`, and `initialFocus`. Existing popovers render the same as before.

`Popover` fix: a `style` prop is now merged with the positioning styles instead of replacing them, so passing `style` no longer breaks placement.

Type changes:

- `PopoverProps` is now a union of trigger and anchored props, so `interface X extends PopoverProps` no longer compiles. Use `type X = PopoverProps & { ... }` instead.
- `role` accepts the roles Floating UI supports (`dialog`, `alertdialog`, `menu`, `listbox`, `tooltip`, `grid`, `tree`, `select`, `label`, `combobox`) instead of any string.
