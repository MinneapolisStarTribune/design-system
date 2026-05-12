import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Checkbox, type CheckboxVariant } from '../../Checkbox/native/Checkbox.native';
import { useNativeStyles, type NativeTheme } from '@/hooks/useNativeStyles';
import { getCategoryState, toggleCategoryValues, toggleOptionValue } from '../CheckboxGroup.shared';
import type { CheckboxCategory, CheckboxGroupNativeProps } from '../CheckboxGroup.types';

const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    root: {
      flexDirection: 'column',
      rowGap: theme.spacing12,
      paddingTop: theme.spacing8,
    },
    categoryMode: {
      rowGap: theme.spacing12,
    },
    category: {
      rowGap: theme.spacing12,
    },
    categoryOptions: {
      rowGap: theme.spacing12,
      paddingLeft: theme.spacing24,
    },
  });

export const CheckboxGroup: React.FC<CheckboxGroupNativeProps> = ({
  value,
  options,
  categories,
  color = 'neutral',
  disabled = false,
  error = false,
  onChange,
  analytics: _analytics,
  style,
  dataTestId,
  accessibilityLabel,
}) => {
  const styles = useNativeStyles(createStyles);
  const variant: CheckboxVariant = color;
  const isCategoryMode = Boolean(categories && categories.length > 0);
  const items = isCategoryMode ? categories : null;

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
      <View style={[styles.root, styles.categoryMode, style]} testID={dataTestId}>
        {items.map((category) => {
          const state = getCategoryState(category, value);
          const parentChecked = state === 'checked';
          const parentIndeterminate = state === 'indeterminate';

          return (
            <View key={category.parentOption.value} style={styles.category}>
              <Checkbox
                title={category.parentOption.title}
                description={category.parentOption.description}
                checked={parentChecked}
                indeterminate={parentIndeterminate}
                variant={variant}
                disabled={disabled}
                error={error}
                onChange={() => toggleCategory(category)}
                dataTestId={`${dataTestId ?? 'checkbox-group'}-category-${category.parentOption.value}`}
              />
              <View
                style={styles.categoryOptions}
                accessibilityLabel={accessibilityLabel}
                importantForAccessibility="no"
              >
                {category.options.map((option) => (
                  <Checkbox
                    key={option.value}
                    title={option.title}
                    description={option.description}
                    checked={value.includes(option.value)}
                    variant={variant}
                    disabled={disabled}
                    error={error}
                    onChange={(checked) => toggleValue(option.value, checked)}
                    dataTestId={`${dataTestId ?? 'checkbox-group'}-option-${option.value}`}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  const flatOptions = options ?? [];
  return (
    <View style={[styles.root, style]} testID={dataTestId} accessibilityLabel={accessibilityLabel}>
      {flatOptions.map((option) => (
        <Checkbox
          key={option.value}
          title={option.title}
          description={option.description}
          checked={value.includes(option.value)}
          variant={variant}
          disabled={disabled}
          error={error}
          onChange={(checked) => toggleValue(option.value, checked)}
          dataTestId={`${dataTestId ?? 'checkbox-group'}-option-${option.value}`}
        />
      ))}
    </View>
  );
};

export type {
  CheckboxGroupNativeProps,
  CheckboxGroupProps,
  CheckboxOption,
  CheckboxCategory,
} from '../CheckboxGroup.types';
