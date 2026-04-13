import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { UtilityBody } from '@/components/Typography/Utility/UtilityBody/native/UtilityBody.native';
import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/native/UtilityLabel.native';
import { useNativeStyles, type NativeTheme } from '@/hooks/useNativeStyles';
import { BaseProps } from '@/types/globalTypes';

export const CHECKBOX_VARIANTS = ['neutral', 'brand'] as const;
export type CheckboxVariant = (typeof CHECKBOX_VARIANTS)[number];

export interface CheckboxProps extends Omit<BaseProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** Required label text */
  title: string;
  /** Optional supporting text below the title */
  description?: string;
  /** Controlled checked state */
  checked: boolean;
  /**
   * Indeterminate (mixed) state — visual only; set programmatically.
   * When the user activates the control, `onChange(true)` is called so the parent can clear indeterminate.
   */
  indeterminate?: boolean;
  /** Color variant — neutral is the default */
  variant?: CheckboxVariant;
  disabled?: boolean;
  error?: boolean;
  onChange: (checked: boolean) => void;
}

function getVisualBoxColors(
  theme: NativeTheme,
  variant: CheckboxVariant,
  checked: boolean,
  indeterminate: boolean,
  error: boolean
) {
  const isOn = checked || indeterminate;

  if (!isOn) {
    return {
      borderColor: error
        ? theme.colorBorderStateAttentionOnLight
        : theme.colorCheckboxBorderUnchecked,
      backgroundColor: 'transparent' as const,
      showIcon: false as const,
      iconColor: theme.colorCheckboxIconUnchecked,
    };
  }

  const borderSelected =
    variant === 'brand'
      ? theme.colorCheckboxBorderSelectedBrand
      : theme.colorCheckboxBorderSelectedNeutral;
  const bgNeutral = theme.colorCheckboxBackgroundSelectedNeutral;
  const bgBrand = theme.colorCheckboxBackgroundSelectedBrand;
  const iconNeutral = theme.colorCheckboxIconSelectedNeutral;
  const iconBrand = theme.colorCheckboxIconSelectedBrand;

  if (error) {
    return {
      borderColor: theme.colorBorderStateAttentionOnLight,
      backgroundColor: variant === 'neutral' ? bgNeutral : bgBrand,
      showIcon: true as const,
      iconColor: variant === 'neutral' ? iconNeutral : iconBrand,
    };
  }

  return {
    borderColor: borderSelected,
    backgroundColor: variant === 'brand' ? bgBrand : bgNeutral,
    showIcon: true as const,
    iconColor: variant === 'brand' ? iconBrand : iconNeutral,
  };
}

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
  const { styles, showIcon } = useNativeStyles((theme) => {
    const box = getVisualBoxColors(theme, variant, checked, indeterminate, error);
    const size = theme.spacingCheckboxDefault;

    return {
      showIcon: box.showIcon,
      styles: StyleSheet.create({
        root: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: theme.spacing8,
          opacity: disabled ? 0.4 : 1,
        },
        pressable: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: theme.spacing8,
          flexShrink: 1,
        },
        visualBox: {
          width: size,
          height: size,
          borderRadius: theme.radius4,
          borderWidth: 1,
          borderColor: box.borderColor,
          backgroundColor: box.backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
        },
        glyph: {
          color: box.iconColor,
          fontSize: Math.round(size * 0.58),
          fontWeight: '700',
          lineHeight: Math.round(size * 0.68),
          marginTop: indeterminate ? -1 : 0,
        },
        textColumn: {
          flexShrink: 1,
          gap: theme.spacing4,
        },
        descriptionText: {
          color: theme.colorTextOnLightTertiary,
        },
      }),
    };
  });

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
        aria-invalid={error ? true : undefined}
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
