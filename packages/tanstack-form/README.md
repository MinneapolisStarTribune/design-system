# @minneapolisstartribune/design-system-tanstack-form

[TanStack Form v1](https://tanstack.com/form) field adapters for `@minneapolisstartribune/design-system`. Each adapter wires a design-system form control (label, description, caption, error state, ARIA) to a TanStack Form field so forms don't have to re-plumb `value` / `onChange` / `onBlur` / errors by hand.

## Install

```sh
yarn add @minneapolisstartribune/design-system-tanstack-form @tanstack/react-form
```

Peer deps: `@minneapolisstartribune/design-system` (web), `@tanstack/react-form` ^1.33.1, `react` 19. Import the design-system CSS as you normally would (`@minneapolisstartribune/design-system/web/components.css`).

## Adapters

| Adapter     | Wraps                     | Field value |
| ----------- | ------------------------- | ----------- |
| `TextField` | `FormGroup` + `TextInput` | `string`    |

## Usage

Use plain `useForm` and pass each `field` to an adapter. Nothing to register, and you only bundle the adapters you import.

```tsx
import { useForm } from '@tanstack/react-form';
import { TextField } from '@minneapolisstartribune/design-system-tanstack-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().trim().min(1, 'Email is required').pipe(z.email('Enter a valid email')),
});

// Type the defaults with the schema's input type and useForm infers every field from it.
const defaultValues: z.input<typeof schema> = { email: '' };

function SignupForm() {
  const form = useForm({
    defaultValues,
    validators: { onChange: schema, onBlur: schema },
    // value is the raw input. Parse it to get the schema's output (trimmed, transformed, typed).
    onSubmit: ({ value }) => save(schema.parse(value)),
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

Each adapter only accepts fields of its value type, so TypeScript rejects e.g. `TextField` on a `number` field.

### Parse on submit

Schema validators only check values. TanStack Form doesn't apply the schema's transforms, so `value` in `onSubmit` is still `z.input<typeof schema>` (untrimmed, uncoerced). Call `schema.parse(value)` in `onSubmit` to get `z.output<typeof schema>`. It won't throw there, since submit only runs once validation has passed.

## Props

Each adapter takes the props of the component it wraps, minus the ones the field drives (value, change handler, `name`, error state). Plus:

| Prop          | Description                                                                  |
| ------------- | ---------------------------------------------------------------------------- |
| `field`       | The field from `form.Field`'s render prop. Required.                         |
| `label`       | Renders `FormGroup.Label`, associated with the control.                      |
| `description` | Renders `FormGroup.Description` under the label.                             |
| `caption`     | Info caption under the control. Replaced by the validation error when shown. |
| `optional`    | Shows the "(Optional)" marker on the label.                                  |

`onChange` / `onBlur` still work. They run after the field is updated.

### Errors

`TextField` shows the first entry of `field.state.meta.errors` as an error caption (`role="alert"`) and puts the input in its error state. Errors stay hidden until the field has been blurred or the form has been submitted. Validators can live on the form (a zod schema, issues map to fields by path) or on `form.Field`.
