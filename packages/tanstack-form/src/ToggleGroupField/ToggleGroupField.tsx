'use client';

import React from 'react';
import {
  ToggleGroup,
  type ToggleGroupSingleProps,
} from '@minneapolisstartribune/design-system/web';
import {
  type BoundField,
  FieldGroup,
  type FieldLabelProps,
  FocusBoundary,
  useFieldError,
  useFieldGroupIds,
} from '../shared/field';

type ToggleGroupRootProps = Omit<
  ToggleGroupSingleProps,
  'type' | 'value' | 'onChange' | 'label' | 'aria-labelledby'
>;

type ToggleGroupFieldMode<T extends string> =
  | {
      /** `single` (default): one selected value, like a radio group. */
      type?: 'single';
      /** The field from `form.Field`'s render prop. A string (or string union) field. */
      field: BoundField<T>;
      /** Runs after the field is updated. */
      onChange?: (value: T) => void;
    }
  | {
      /** `multiple`: any number of values, like checkboxes. */
      type: 'multiple';
      /** The field from `form.Field`'s render prop. A string (or string union) array field. */
      field: BoundField<T[]>;
      /** Runs after the field is updated. */
      onChange?: (value: T[]) => void;
    };

/** The group needs a name: a visible `label`, or `aria-labelledby` pointing at a heading elsewhere. */
type ToggleGroupFieldName =
  | { label: React.ReactNode; 'aria-labelledby'?: string }
  | { label?: React.ReactNode; 'aria-labelledby': string };

export type ToggleGroupFieldProps<T extends string = string> = ToggleGroupRootProps &
  Omit<FieldLabelProps, 'label'> &
  ToggleGroupFieldName &
  ToggleGroupFieldMode<T>;

/**
 * Design-system ToggleGroup bound to a TanStack Form field: a string field for `type="single"`,
 * a string array field for `type="multiple"`. Pass `ToggleGroup.Item`s as children.
 */
export function ToggleGroupField<T extends string = string>(
  props: ToggleGroupFieldProps<T>
): React.ReactElement {
  const {
    label,
    description,
    caption,
    optional,
    'aria-labelledby': ariaLabelledBy,
    children,
    size,
    fullWidth,
    disabled,
    className,
    style,
    dataTestId,
  } = props;
  const errorMessage = useFieldError(props.field);
  // ToggleGroup doesn't read FormGroup context, so the label is wired by id here.
  const ids = useFieldGroupIds();

  const rootProps = {
    children,
    size,
    fullWidth,
    disabled,
    className,
    style,
    dataTestId,
    'aria-labelledby': ariaLabelledBy ?? ids.label,
  };

  return (
    <FieldGroup
      label={label}
      description={description}
      caption={caption}
      optional={optional}
      errorMessage={errorMessage}
      ids={ids}
    >
      <FocusBoundary onLeave={props.field.handleBlur}>
        {props.type === 'multiple' ? (
          <ToggleGroup.Root<T>
            {...rootProps}
            type="multiple"
            value={props.field.state.value}
            onChange={(value) => {
              props.field.handleChange(value);
              props.onChange?.(value);
            }}
          />
        ) : (
          <ToggleGroup.Root<T>
            {...rootProps}
            type="single"
            value={props.field.state.value}
            onChange={(value) => {
              props.field.handleChange(value);
              props.onChange?.(value);
            }}
          />
        )}
      </FocusBoundary>
    </FieldGroup>
  );
}
