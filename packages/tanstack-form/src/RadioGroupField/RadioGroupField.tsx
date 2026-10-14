'use client';

import { RadioGroup, type RadioGroupProps } from '@minneapolisstartribune/design-system/web';
import {
  type BoundField,
  FieldGroup,
  type FieldLabelProps,
  FocusBoundary,
  useFieldError,
} from '../shared/field';

export interface RadioGroupFieldProps
  extends Omit<RadioGroupProps, 'name' | 'value' | 'onChange' | 'error'>,
    FieldLabelProps {
  /** The field from `form.Field`'s render prop. Must be a string field (`null`/`undefined` read as no selection). */
  field: BoundField<string | null | undefined, string>;
  /** Runs after the field is updated. */
  onChange?: (value: string) => void;
}

/** Design-system RadioGroup bound to a TanStack Form string field. */
export const RadioGroupField = ({
  field,
  label,
  description,
  caption,
  optional,
  onChange,
  ...groupProps
}: RadioGroupFieldProps) => {
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
        <RadioGroup
          {...groupProps}
          name={field.name}
          value={field.state.value}
          error={errorMessage !== undefined}
          onChange={(value) => {
            field.handleChange(value);
            onChange?.(value);
          }}
        />
      </FocusBoundary>
    </FieldGroup>
  );
};
