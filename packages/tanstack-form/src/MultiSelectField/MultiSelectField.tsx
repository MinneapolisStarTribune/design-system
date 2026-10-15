'use client';

import { MultiSelect, type MultiSelectProps } from '@minneapolisstartribune/design-system/web';
import {
  type BoundField,
  FieldGroup,
  type FieldLabelProps,
  FocusBoundary,
  useFieldError,
} from '../shared/field';

export interface MultiSelectFieldProps
  extends Omit<MultiSelectProps, 'value' | 'onChange' | 'error'>,
    FieldLabelProps {
  /** The field from `form.Field`'s render prop. Must be a `string[]` field. */
  field: BoundField<string[]>;
  /** Runs after the field is updated. */
  onChange?: (values: string[]) => void;
}

/** Design-system MultiSelect bound to a TanStack Form `string[]` field. */
export const MultiSelectField = ({
  field,
  label,
  description,
  caption,
  optional,
  onChange,
  ...selectProps
}: MultiSelectFieldProps) => {
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
        <MultiSelect
          {...selectProps}
          value={field.state.value}
          onChange={(values) => {
            field.handleChange(values);
            onChange?.(values);
          }}
        />
      </FocusBoundary>
    </FieldGroup>
  );
};
