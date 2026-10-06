---
'@minneapolisstartribune/design-system': minor
---

Add `ToggleGroup` (web): a set of joined toggles, shown in Figma as the segmented control. Compose `ToggleGroup.Root` with `ToggleGroup.Item`.
`type="single"` (default) keeps exactly one item selected and behaves as a radio group; `type="multiple"` lets any number be selected and behaves as a group of checkboxes, with `value` as an array.
Selected items use the filled Button fill of the chosen `color` (`'brand'` by default, or `'neutral'`), so they follow the active brand and color scheme. Item content is free-form: pass text plus inline elements (e.g. a count as fine print) and color secondary content with the `--toggle-group-item-secondary-text` CSS variable, which follows the selected state. Icons go in the children too and take the item's text color; icon-only items need an `aria-label` (a development warning flags items with no accessible name). Also supports `fullWidth`, `disabled` on the group or a single item, and `variant` (`'segmented'`, the only variant today).
