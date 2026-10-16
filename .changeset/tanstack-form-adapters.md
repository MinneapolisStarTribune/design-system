---
'@minneapolisstartribune/design-system': major
'@minneapolisstartribune/design-system-tanstack-form': minor
---

Removed `useFormLogic` and its types (`FormValidationErrors`, `UseFormLogicOptions`, `UseFormLogicReturn`). Use TanStack Form v1 with the new `@minneapolisstartribune/design-system-tanstack-form` package instead, see the Form docs in Storybook.

The new package has an adapter for every web input: `TextField`, `PasswordField`, `NumberField`, `SelectField`, `MultiSelectField`, `RadioGroupField`, `CheckboxField`, `CheckboxGroupField`, `SwitchField` and `ToggleGroupField`. Each wraps the control in a `FormGroup`, binds it to a field of the matching value type, and shows the field's validation error as an error caption once the field is blurred or the form is submitted.

`Checkbox` and `ToggleGroup.Root` take an `aria-describedby` prop, so an error caption rendered outside them can be linked to the control. On `Checkbox` it's added alongside the checkbox's own caption.
