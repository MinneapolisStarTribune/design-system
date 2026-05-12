import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, type TextStyle, View } from 'react-native';
import type { FC } from 'react';
import { useFormGroupContext } from '@/components/FormGroup/FormGroupContext';
import { useNativeStyles, type NativeTheme } from '@/hooks/useNativeStyles';
import { ChevronDownIcon, ChevronUpIcon } from '@/icons';
import type { SelectNativeProps as SelectProps } from '../Select.types';

type SelectSize = NonNullable<SelectProps['size']>;

const SIZE_TOKENS: Record<
  SelectSize,
  {
    valueTypography: keyof NativeTheme;
    placeholderTypography: keyof NativeTheme;
  }
> = {
  small: {
    valueTypography: 'typographyUtilityTextRegularSmall',
    placeholderTypography: 'typographyUtilityTextItalicSmall',
  },
  medium: {
    valueTypography: 'typographyUtilityTextRegularMedium',
    placeholderTypography: 'typographyUtilityTextItalicMedium',
  },
  large: {
    valueTypography: 'typographyUtilityTextRegularLarge',
    placeholderTypography: 'typographyUtilityTextItalicLarge',
  },
};

function readTypography(theme: NativeTheme, key: keyof NativeTheme): TextStyle {
  const token = theme[key];
  if (token == null || typeof token !== 'object') return {};
  return token as TextStyle;
}

export const Select: FC<SelectProps> = (props) => {
  const {
    options,
    value,
    placeholderText = 'Select an option',
    showPlaceholder = true,
    size = 'medium',
    rounded = false,
    isDisabled = false,
    isError: isErrorProp,
    id: idProp,
    dataTestId,
    style,
    accessibilityLabel,
    accessibilityHint,
    onChange,
  } = props;
  const [expanded, setExpanded] = useState(false);

  const formGroup = useFormGroupContext();
  const hasError = isErrorProp ?? formGroup?.hasError ?? false;
  const inputId = idProp ?? formGroup?.inputId;

  const selectedOption = useMemo(
    () => (value ? options.find((option) => option.value === value) : undefined),
    [options, value]
  );
  const isFilled = Boolean(selectedOption);
  const displayLabel =
    isFilled && selectedOption ? selectedOption.label : showPlaceholder ? placeholderText : '';
  const controlLabel = accessibilityLabel ?? (displayLabel || placeholderText);

  const sizeTokens = SIZE_TOKENS[size];
  const styles = useNativeStyles(
    useCallback(
      (theme: NativeTheme) =>
        StyleSheet.create({
          shell: {
            width: '100%',
            minWidth: 0,
            borderWidth: 1,
            borderColor: theme.colorBorderOnLightSubtle02,
            backgroundColor: theme.colorBackgroundLightDefault,
            paddingVertical: theme.spacing12,
            paddingHorizontal: theme.spacing16,
            borderRadius: theme.radius4,
          },
          shellRounded: {
            borderRadius: theme.radiusFull,
          },
          shellError: {
            borderColor: theme.colorBorderStateAttentionOnLight,
          },
          shellPressed: {
            opacity: 0.85,
          },
          shellDisabled: {
            opacity: 0.6,
          },
          inner: {
            flexDirection: 'row',
            alignItems: 'center',
            minWidth: 0,
            gap: theme.spacing8,
          },
          valueText: {
            flex: 1,
            color: theme.colorTextOnLightPrimary,
            ...readTypography(theme, sizeTokens.valueTypography),
          },
          placeholderText: {
            color: theme.colorTextOnLightTertiary,
            ...readTypography(theme, sizeTokens.placeholderTypography),
          },
          chevron: {
            flexShrink: 0,
          },
          dropdown: {
            marginTop: theme.spacing8,
            borderWidth: 1,
            borderColor: theme.colorBorderOnLightSubtle02,
            backgroundColor: theme.colorBackgroundLightDefault,
            borderRadius: theme.radius4,
            overflow: 'hidden',
          },
          optionRow: {
            paddingVertical: theme.spacing12,
            paddingHorizontal: theme.spacing16,
          },
          optionSelected: {
            backgroundColor: theme.colorBackgroundLightGray01,
          },
          optionDisabled: {
            opacity: 0.5,
          },
          optionText: {
            color: theme.colorTextOnLightPrimary,
            ...readTypography(theme, sizeTokens.valueTypography),
          },
          optionTextDisabled: {
            color: theme.colorTextOnLightTertiary,
          },
        }),
      [sizeTokens]
    )
  );

  const toggleExpanded = () => {
    if (isDisabled) return;
    setExpanded((prev) => !prev);
  };

  const handleSelectOption = (nextValue: string, optionDisabled?: boolean) => {
    if (isDisabled || optionDisabled) return;
    onChange?.(nextValue);
    setExpanded(false);
  };

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={controlLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled, expanded }}
        disabled={isDisabled}
        onPress={toggleExpanded}
        testID={dataTestId}
        nativeID={inputId}
        style={({ pressed }) => [
          styles.shell,
          rounded ? styles.shellRounded : null,
          hasError ? styles.shellError : null,
          isDisabled ? styles.shellDisabled : null,
          pressed && !isDisabled ? styles.shellPressed : null,
          style,
        ]}
      >
        <View style={styles.inner}>
          <Text
            style={[styles.valueText, !isFilled && showPlaceholder ? styles.placeholderText : null]}
            numberOfLines={1}
          >
            {displayLabel}
          </Text>
          <View
            style={styles.chevron}
            testID={
              expanded ? `${dataTestId ?? 'select'}-icon-up` : `${dataTestId ?? 'select'}-icon-down`
            }
          >
            {expanded ? (
              <ChevronUpIcon
                size={size}
                color={isDisabled ? 'state-disabled-on-light' : 'on-light-primary'}
              />
            ) : (
              <ChevronDownIcon
                size={size}
                color={isDisabled ? 'state-disabled-on-light' : 'on-light-primary'}
              />
            )}
          </View>
        </View>
      </Pressable>

      {expanded ? (
        <View style={styles.dropdown} testID={`${dataTestId ?? 'select'}-options`}>
          {options.map((option) => {
            const optionSelected = value === option.value;
            const optionDisabled = Boolean(option.disabled) || isDisabled;
            return (
              <Pressable
                key={option.value}
                testID={`${dataTestId ?? 'select'}-option-${option.value}`}
                accessibilityRole="button"
                accessibilityLabel={option.label}
                accessibilityState={{ disabled: optionDisabled, selected: optionSelected }}
                disabled={optionDisabled}
                onPress={() => handleSelectOption(option.value, option.disabled)}
                style={[
                  styles.optionRow,
                  optionSelected ? styles.optionSelected : null,
                  optionDisabled ? styles.optionDisabled : null,
                ]}
              >
                <Text
                  style={[styles.optionText, optionDisabled ? styles.optionTextDisabled : null]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};
