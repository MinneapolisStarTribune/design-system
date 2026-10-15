'use client';

import { Select, type SelectProps } from '@minneapolisstartribune/design-system/web';
import {
  type BoundField,
  FieldGroup,
  type FieldLabelProps,
  FocusBoundary,
  useFieldError,
} from '../shared/field';

export interface SelectFieldProps
  extends Omit<SelectProps, 'id' | 'value' | 'onChange' | 'isError'>,
    FieldLabelProps {
  /** The field from `form.Field`'s render prop. Must be a string field (`null`/`undefined` read as no selection). */
  field: BoundField<string | null | undefined, string>;
  /** Defaults to the FormGroup's generated id. */
  id?: string;
  /** Runs after the field is updated. */
  onChange?: (value: string) => void;
}

/** Design-system Select bound to a TanStack Form string field. */
export const SelectField = ({
  field,
  label,
  description,
  caption,
  optional,
  id,
  onChange,
  ...selectProps
}: SelectFieldProps) => {
  const errorMessage = useFieldError(field);

  return (
    <FieldGroup
      label={label}
      description={description}
      caption={caption}
      optional={optional}
      errorMessage={errorMessage}
    >
      <FocusBoundary onLeave={field.handleBlur}>
        <Select
          {...selectProps}
          // Select falls back to the FormGroup id when this is undefined.
          id={id as string}
          value={field.state.value ?? undefined}
          onChange={(value) => {
            field.handleChange(value);
            onChange?.(value);
          }}
        />
      </FocusBoundary>
    </FieldGroup>
  );
};
