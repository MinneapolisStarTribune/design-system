'use client';

import { NumberInput, type NumberInputProps } from '@minneapolisstartribune/design-system/web';
import { type BoundField, FieldGroup, type FieldLabelProps, useFieldError } from '../shared/field';

export interface NumberFieldProps
  extends Omit<NumberInputProps, 'value' | 'defaultValue' | 'name' | 'isError' | 'aria-invalid'>,
    FieldLabelProps {
  /**
   * The field from `form.Field`'s render prop. Must be a `number | undefined` field: clearing the
   * input writes `undefined`.
   */
  field: BoundField<number | undefined>;
}

/** Design-system NumberInput bound to a TanStack Form `number | undefined` field. */
export const NumberField = ({
  field,
  label,
  description,
  caption,
  optional,
  onChange,
  onBlur,
  ...inputProps
}: NumberFieldProps) => {
  const errorMessage = useFieldError(field);

  return (
    <FieldGroup
      label={label}
      description={description}
      caption={caption}
      optional={optional}
      errorMessage={errorMessage}
    >
      <NumberInput
        {...inputProps}
        name={field.name}
        // '' keeps the input controlled while empty. NumberInput's type only allows numerics.
        value={(field.state.value ?? '') as NumberInputProps['value']}
        isError={errorMessage !== undefined}
        onChange={(event) => {
          const next = event.target.valueAsNumber;
          field.handleChange(Number.isNaN(next) ? undefined : next);
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
