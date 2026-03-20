import React, { useCallback } from 'react';
import classNames from 'classnames';
import { BaseProps } from '@/types/globalTypes';
import { Checkbox, type CheckboxVariant } from '../../Checkbox/web/Checkbox';
import styles from './CheckboxGroup.module.scss';

export interface CheckboxOption {
  value: string;
  title: string;
  description?: string;
}

export interface CheckboxCategory {
  parentOption: CheckboxOption;
  options: CheckboxOption[];
}

export type CheckboxGroupProps = BaseProps & {
  value: string[];
  color?: 'neutral' | 'brand';
  disabled?: boolean;
  error?: boolean;
  onChange: (values: string[]) => void;
  /** Per-group tracking data merged into each Checkbox event. Use to distinguish groups (e.g. form_field, module_name). */
  analytics?: Record<string, unknown>;
} & (
    | { options: CheckboxOption[]; categories?: never } // flat mode
    | { categories: CheckboxCategory[]; options?: never } // category mode
  );

function getCategoryState(
  category: CheckboxCategory,
  selectedValues: string[]
): 'checked' | 'unchecked' | 'indeterminate' {
  const categoryValues = category.options.map((o) => o.value);
  const selectedInCategory = categoryValues.filter((v) => selectedValues.includes(v));
  const count = selectedInCategory.length;
  if (count === 0) return 'unchecked';
  if (count === categoryValues.length) return 'checked';
  return 'indeterminate';
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  value,
  options,
  categories,
  color = 'neutral',
  disabled = false,
  error = false,
  onChange,
  analytics: analyticsOverride,
  className,
  dataTestId,
}) => {
  const variant: CheckboxVariant = color;

  const isCategoryMode = Boolean(categories && categories.length > 0);
  const items = isCategoryMode ? categories! : null;

  const toggleValue = useCallback(
    (optionValue: string, add: boolean) => {
      if (add) {
        onChange([...value, optionValue]);
      } else {
        onChange(value.filter((v) => v !== optionValue));
      }
    },
    [value, onChange]
  );

  const toggleCategory = useCallback(
    (category: CheckboxCategory) => {
      const categoryValues = category.options.map((o) => o.value);
      const selectedInCategory = categoryValues.filter((v) => value.includes(v));
      const allSelected = selectedInCategory.length === categoryValues.length;

      if (allSelected) {
        onChange(value.filter((v) => !categoryValues.includes(v)));
      } else {
        const newValues = new Set(value);
        categoryValues.forEach((v) => newValues.add(v));
        onChange([...newValues]);
      }
    },
    [value, onChange]
  );

  if (isCategoryMode && items) {
    return (
      <div
        className={classNames(styles.root, styles.categoryMode, className)}
        data-testid={dataTestId}
        role="group"
      >
        {items.map((category) => {
          const state = getCategoryState(category, value);
          const parentChecked = state === 'checked';
          const parentIndeterminate = state === 'indeterminate';

          return (
            <div key={category.parentOption.value} className={styles.category}>
              <div className={styles.categoryHeader}>
                <Checkbox
                  label={category.parentOption.title}
                  caption={category.parentOption.description}
                  checked={parentChecked}
                  indeterminate={parentIndeterminate}
                  variant={variant}
                  disabled={disabled}
                  error={error}
                  onChange={() => toggleCategory(category)}
                  analytics={{ ...analyticsOverride, option_value: category.parentOption.value, is_category: true }}
                  dataTestId={`${dataTestId ?? 'checkbox-group'}-category-${category.parentOption.value}`}
                />
              </div>
              <div className={styles.categoryOptions}>
                {category.options.map((option) => (
                  <Checkbox
                    key={option.value}
                    label={option.title}
                    caption={option.description}
                    checked={value.includes(option.value)}
                    variant={variant}
                    disabled={disabled}
                    error={error}
                    onChange={(checked) => toggleValue(option.value, checked)}
                    analytics={{ ...analyticsOverride, option_value: option.value }}
                    dataTestId={`${dataTestId ?? 'checkbox-group'}-option-${option.value}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const flatOptions = options ?? [];
  return (
    <div
      className={classNames(styles.root, styles.flatMode, className)}
      data-testid={dataTestId}
      role="group"
    >
      {flatOptions.map((option) => (
        <Checkbox
          key={option.value}
          label={option.title}
          caption={option.description}
          checked={value.includes(option.value)}
          variant={variant}
          disabled={disabled}
          error={error}
          onChange={(checked) => toggleValue(option.value, checked)}
          analytics={{ ...analyticsOverride, option_value: option.value }}
          dataTestId={`${dataTestId ?? 'checkbox-group'}-option-${option.value}`}
        />
      ))}
    </div>
  );
};
