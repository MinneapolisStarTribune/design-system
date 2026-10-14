'use client';

import { TextInput, type TextInputProps } from '@minneapolisstartribune/design-system/web';
import { type BoundField, FieldGroup, type FieldLabelProps, useFieldError } from '../shared/field';

export interface TextFieldProps
  extends Omit<TextInputProps, 'value' | 'name' | 'isError' | 'aria-invalid'>,
    FieldLabelProps {
  /** The field from `form.Field`'s render prop. Must be a string field. */
  field: BoundField<string>;
}

/**
 * Design-system TextInput bound to a TanStack Form field: `<TextField field={field} />`.
 *
 * Shows the first of `field.state.meta.errors` once the field has been blurred or the form
 * has been submitted.
 */
export const TextField = ({
  field,
  label,
  description,
  caption,
  optional,
  onChange,
  onBlur,
  ...inputProps
}: TextFieldProps) => {
  const errorMessage = useFieldError(field);

  return (
    <FieldGroup
      label={label}
      description={description}
      caption={caption}
      optional={optional}
      errorMessage={errorMessage}
    >
      <TextInput
        {...inputProps}
        name={field.name}
        value={field.state.value}
        isError={errorMessage !== undefined}
        onChange={(event) => {
          field.handleChange(event.target.value);
          onChange?.(event);
        }}
        onBlur={(event) => {
          field.handleBlur();
          onBlur?.(event);
        }}
      />
    </FieldGroup>
  );
};
