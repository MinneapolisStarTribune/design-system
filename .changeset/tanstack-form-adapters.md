---
'@minneapolisstartribune/design-system': major
'@minneapolisstartribune/design-system-tanstack-form': minor
---

Removed `useFormLogic` and its types (`FormValidationErrors`, `UseFormLogicOptions`, `UseFormLogicReturn`). Use TanStack Form v1 with the new `@minneapolisstartribune/design-system-tanstack-form` package instead, see the Form docs in Storybook.

The new package starts with a `TextField` adapter. It wraps `TextInput` in a `FormGroup`, binds it to a string field, and shows the field's validation error as an error caption once the field is blurred or the form is submitted.
