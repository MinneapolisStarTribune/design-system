# @minneapolisstartribune/design-system-tanstack-form

[TanStack Form v2](https://tanstack.com/form) field adapters for `@minneapolisstartribune/design-system`. Each adapter wires a design-system form control (label, description, caption, error state, ARIA) to a TanStack Form field so forms don't have to re-plumb `value` / `onChange` / `onBlur` / errors by hand.

> TanStack Form v2 is in alpha. This package tracks `@tanstack/react-form@^2.0.0-alpha.2` and may break alongside it.

## Install

```sh
yarn add @minneapolisstartribune/design-system-tanstack-form @tanstack/react-form@alpha
```

Peer deps: `@minneapolisstartribune/design-system` (web), `@tanstack/react-form` v2, `react` 19. Import the design-system CSS as you normally would (`@minneapolisstartribune/design-system/web/components.css`).

## Adapters

| Adapter     | Wraps                     | Field value |
| ----------- | ------------------------- | ----------- |
| `TextField` | `FormGroup` + `TextInput` | `string`    |

## Usage

Use plain `useForm`, spread in `formDefaults`, and pass each `field` to an adapter. Nothing to register, and you only bundle the adapters you import.

```tsx
import { useForm } from '@tanstack/react-form';
import { formDefaults, TextField } from '@minneapolisstartribune/design-system-tanstack-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().min(1, 'Email is required').pipe(z.email('Enter a valid email')),
});

function SignupForm() {
  const form = useForm({
    ...formDefaults,
    defaultValues: { email: '' },
    validators: [{ run: schema, triggers: ['change', 'blur'] }],
    onSubmit: ({ value }) => save(value),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="email">
        {(field) => (
          <TextField field={field} label="Email" caption="We never share it" type="email" />
        )}
      </form.Field>
    </form>
  );
}
```

`TextField` only accepts string fields, so TypeScript rejects it on a `number` or object field.

`formDefaults` currently sets `errorVisibility` so errors show once a field is blurred or the form has been submitted. Spread it first so anything you pass per form wins.

If you want the `field.TextField` shorthand or `defineAppFieldGroup`, wrap adapters yourself with `getFormHookHelpers().fieldComponent.strict(TextField, 'field')` and register them with `createFormHook`. Every form using that hook then bundles every registered adapter.

## `TextField` props

Everything `TextInput` accepts (`size`, `placeholderText`, `icon`, `rounded`, `isDisabled`, `isSuccess`, `analytics`, `type`, …) except `value`, `name`, `isError` and `aria-invalid`, which come from the field. Plus:

| Prop          | Description                                                                |
| ------------- | -------------------------------------------------------------------------- |
| `field`       | The field from `form.Field`'s render prop. Required.                       |
| `label`       | Renders `FormGroup.Label`, associated with the input.                      |
| `description` | Renders `FormGroup.Description` under the label.                           |
| `caption`     | Info caption under the input. Replaced by the validation error when shown. |
| `optional`    | Shows the "(Optional)" marker on the label.                                |

`onChange` / `onBlur` still work — they run after the field is updated.

### Errors

The adapter shows the first entry of `field.errors` as an error caption (`role="alert"`) and puts the input in its error state. `field.errors` already respects the form's `errorVisibility` policy, so decide _when_ errors appear there (form- or field-level), not in the component.
