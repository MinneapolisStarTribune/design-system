'use client';

import { Checkbox, type CheckboxProps } from '@minneapolisstartribune/design-system/web';
import { type BoundField, FieldGroup, FocusBoundary, useFieldError } from '../shared/field';

export interface CheckboxFieldProps extends Omit<CheckboxProps, 'checked' | 'onChange' | 'error'> {
  /** The field from `form.Field`'s render prop. Must be a boolean field. */
  field: BoundField<boolean>;
  /** Runs after the field is updated. */
  onChange?: (checked: boolean) => void;
}

/**
 * Design-system Checkbox bound to a TanStack Form boolean field. `label` and `caption` are the
 * checkbox's own; the validation error shows as a caption below it.
 */
export const CheckboxField = ({ field, onChange, ...checkboxProps }: CheckboxFieldProps) => {
  const errorMessage = useFieldError(field);

  return (
    <FieldGroup errorMessage={errorMessage}>
      <FocusBoundary onLeave={field.handleBlur}>
        <Checkbox
          {...checkboxProps}
          checked={field.state.value}
          error={errorMessage !== undefined}
          onChange={(checked) => {
            field.handleChange(checked);
            onChange?.(checked);
          }}
        />
      </FocusBoundary>
    </FieldGroup>
  );
};
