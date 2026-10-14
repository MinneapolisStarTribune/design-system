'use client';

import { PasswordInput, type PasswordInputProps } from '@minneapolisstartribune/design-system/web';
import { type BoundField, FieldGroup, type FieldLabelProps, useFieldError } from '../shared/field';

export interface PasswordFieldProps
  extends Omit<PasswordInputProps, 'value' | 'name' | 'isError' | 'aria-invalid'>,
    FieldLabelProps {
  /** The field from `form.Field`'s render prop. Must be a string field. */
  field: BoundField<string>;
}

/** Design-system PasswordInput bound to a TanStack Form string field. */
export const PasswordField = ({
  field,
  label,
  description,
  caption,
  optional,
  onChange,
  onBlur,
  ...inputProps
}: PasswordFieldProps) => {
  const errorMessage = useFieldError(field);

  return (
    <FieldGroup
      label={label}
      description={description}
      caption={caption}
      optional={optional}
      errorMessage={errorMessage}
    >
      <PasswordInput
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
