---
'@minneapolisstartribune/design-system': minor
---

`Menu` supports every variant in the Core Components Dropdown Menu design:

- `Menu.Group` adds a titled group (`role="group"`, named by its title).
- `Menu.CheckboxItem` toggles an option for multi-select menus (`menuitemcheckbox`). It stays open on select by default.
- `Menu.RadioItem` marks the current choice of a single-select set (`menuitemradio`), shown as the design's Selected state.
- `Menu.ItemCount` shows a result count, such as `(112)`, at the end of a row.
- `Menu.Submenu` opens a nested menu beside its row. Right Arrow, Enter, Space, a click, or hovering opens it, and Left Arrow or Escape closes it.
- `Menu.Empty` shows "No options" when there is nothing to choose.

Exports the `MenuCheckboxItemProps`, `MenuRadioItemProps`, `MenuGroupProps`, `MenuItemCountProps`, `MenuSubmenuProps`, and `MenuEmptyProps` types.
