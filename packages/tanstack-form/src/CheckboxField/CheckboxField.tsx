'use client';

import { Checkbox, type CheckboxProps } from '@minneapolisstartribune/design-system/web';
import {
  type BoundField,
  describedBy,
  FieldGroup,
  FocusBoundary,
  useFieldError,
  useFieldGroupIds,
} from '../shared/field';

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
  // Checkbox doesn't read FormGroup context, so the error caption is wired here.
  const ids = useFieldGroupIds();

  return (
    <FieldGroup errorMessage={errorMessage} ids={ids}>
      <FocusBoundary onLeave={field.handleBlur}>
        <Checkbox
          {...checkboxProps}
          checked={field.state.value}
          error={errorMessage !== undefined}
          aria-describedby={describedBy(ids, { errorMessage })}
          onChange={(checked) => {
            field.handleChange(checked);
            onChange?.(checked);
          }}
        />
      </FocusBoundary>
    </FieldGroup>
  );
};
