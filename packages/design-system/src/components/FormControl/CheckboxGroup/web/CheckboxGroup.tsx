'use client';

import React, { useCallback } from 'react';
import classNames from 'classnames';
import { Checkbox, type CheckboxVariant } from '../../Checkbox/web/Checkbox';
import { getCategoryState, toggleCategoryValues, toggleOptionValue } from '../CheckboxGroup.shared';
import type { CheckboxCategory, CheckboxGroupProps, CheckboxOption } from '../CheckboxGroup.types';
import styles from './CheckboxGroup.module.scss';

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
      onChange(toggleOptionValue(value, optionValue, add));
    },
    [value, onChange]
  );

  const toggleCategory = useCallback(
    (category: CheckboxCategory) => {
      onChange(toggleCategoryValues(value, category));
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
                  analytics={{
                    ...analyticsOverride,
                    option_value: category.parentOption.value,
                    is_category: true,
                  }}
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

export type { CheckboxOption, CheckboxCategory, CheckboxGroupProps };
