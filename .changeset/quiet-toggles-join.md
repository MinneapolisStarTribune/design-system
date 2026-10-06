---
'@minneapolisstartribune/design-system': minor
---

Add `ToggleGroup` (web): a set of joined toggles, shown in Figma as the segmented control. Compose `ToggleGroup.Root` with `ToggleGroup.Item`.
`type="single"` (default) keeps exactly one item selected and behaves as a radio group; `type="multiple"` lets any number be selected and behaves as a group of checkboxes, with `value` as an array.