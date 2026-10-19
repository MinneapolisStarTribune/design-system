---
'@minneapolisstartribune/design-system': minor
'@minneapolisstartribune/design-system-tanstack-form': minor
---

Added `PasswordField`, `NumberField`, `SelectField`, `MultiSelectField`, `RadioGroupField`, `CheckboxField`, `CheckboxGroupField`, `SwitchField` and `ToggleGroupField` adapters.

`Checkbox` and `ToggleGroup.Root` take an `aria-describedby` prop, so an error caption rendered outside them can be linked to the control. On `Checkbox` it's added alongside the checkbox's own caption.
