import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { UtilityBody } from '@/components/Typography/Utility/UtilityBody/native/UtilityBody.native';
import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/native/UtilityLabel.native';
import { useNativeStyles, type NativeTheme } from '@/hooks/useNativeStyles';
import type { CheckboxProps } from '../Checkbox.types.native';
import { createCheckboxStyles } from './Checkbox.native.styles';

export type { CheckboxProps, CheckboxVariant } from '../Checkbox.types.native';
export { CHECKBOX_VARIANTS } from '../Checkbox.types.native';

/**
 * Single checkbox for React Native. Uses `accessibilityRole="checkbox"` with `accessibilityState.checked`
 * set to `"mixed"` when indeterminate. The indeterminate state is visual only — user interaction reports
 * a boolean to `onChange` (typically `true` when leaving mixed).
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  title,
  description,
  checked,
  indeterminate = false,
  variant = 'neutral',
  disabled = false,
  error = false,
  onChange,
  className: _className,
  style,
  dataTestId = 'checkbox',
}) => {
  const styleFactory = useCallback(
    (theme: NativeTheme) =>
      createCheckboxStyles(theme, {
        variant,
        checked,
        indeterminate,
        error,
        disabled,
      }),
    [variant, checked, indeterminate, error, disabled]
  );

  const { styles, showIcon } = useNativeStyles(styleFactory);

  const handlePress = () => {
    if (disabled) return;
    if (indeterminate) {
      onChange(true);
      return;
    }
    onChange(!checked);
  };

  const accessibilityChecked = indeterminate ? 'mixed' : checked;

  return (
    <View style={[styles.root, style]} testID={dataTestId}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={title}
        accessibilityHint={description}
        accessibilityState={{
          checked: accessibilityChecked,
          disabled,
        }}
        disabled={disabled}
        onPress={handlePress}
        style={styles.pressable}
        testID={`${dataTestId}-control`}
        {...(error ? { 'aria-invalid': true } : {})}
      >
        {({ pressed }) => (
          <>
            <View style={[styles.visualBox, pressed && !disabled ? { opacity: 0.92 } : null]}>
              {showIcon ? (
                <Text
                  style={styles.glyph}
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                >
                  {indeterminate ? '−' : '✓'}
                </Text>
              ) : null}
            </View>
            <View style={styles.textColumn} importantForAccessibility="no-hide-descendants">
              <UtilityLabel size="large" weight="regular">
                {title}
              </UtilityLabel>
              {description ? (
                <UtilityBody
                  size="x-small"
                  weight="regular"
                  style={styles.descriptionText as React.CSSProperties}
                >
                  {description}
                </UtilityBody>
              ) : null}
            </View>
          </>
        )}
      </Pressable>
    </View>
  );
};
