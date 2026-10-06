'use client';

import { useId } from 'react';
import classNames from 'classnames';
import styles from './ToggleGroup.module.scss';
import type { ToggleGroupProps } from './ToggleGroup.types';
import { ToggleGroupContext, type ToggleGroupContextValue } from './ToggleGroupContext';

/**
 * Group of joined toggles. `type="single"` (default) keeps exactly one item selected, like a
 * radio group; `type="multiple"` lets any number be selected, like checkboxes.
 */
export function ToggleGroupRoot<T extends string = string>(
  props: ToggleGroupProps<T>
): React.ReactElement {
  const {
    children,
    label,
    'aria-labelledby': ariaLabelledBy,
    name: nameProp,
    fullWidth = false,
    disabled = false,
    className,
    style,
    dataTestId = 'toggle-group',
  } = props;

  const generatedName = useId();
  const name = nameProp ?? generatedName;
  const isMultiple = props.type === 'multiple';

  const context: ToggleGroupContextValue = {
    type: isMultiple ? 'multiple' : 'single',
    name,
    disabled,
    dataTestId,
    isSelected: (itemValue) =>
      props.type === 'multiple' ? props.value.includes(itemValue as T) : props.value === itemValue,
    onItemChange: (itemValue, checked) => {
      if (props.type === 'multiple') {
        props.onChange(
          checked
            ? [...props.value, itemValue as T]
            : props.value.filter((selected) => selected !== itemValue)
        );
      } else if (checked && props.value !== itemValue) {
        props.onChange(itemValue as T);
      }
    },
  };

  return (
    <div
      role={isMultiple ? 'group' : 'radiogroup'}
      aria-label={ariaLabelledBy ? undefined : label}
      aria-labelledby={ariaLabelledBy}
      aria-disabled={disabled || undefined}
      className={classNames(styles.root, { [styles.fullWidth]: fullWidth }, className)}
      style={style}
      data-testid={dataTestId}
    >
      <ToggleGroupContext.Provider value={context}>{children}</ToggleGroupContext.Provider>
    </div>
  );
}
