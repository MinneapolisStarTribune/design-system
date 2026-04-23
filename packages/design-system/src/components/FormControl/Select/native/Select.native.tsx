import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, type TextStyle, View } from 'react-native';
import type { FC } from 'react';
import { useFormGroupContext } from '@/components/FormGroup/FormGroupContext';
import { useNativeStyles, type NativeTheme } from '@/hooks/useNativeStyles';
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
  } = props;

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
          inner: {
            flexDirection: 'row',
            alignItems: 'center',
            minWidth: 0,
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
        }),
      [sizeTokens]
    )
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (displayLabel || placeholderText)}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, expanded: false }}
      disabled={isDisabled}
      testID={dataTestId}
      nativeID={inputId}
      style={({ pressed }) => [
        styles.shell,
        rounded ? styles.shellRounded : null,
        hasError ? styles.shellError : null,
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
      </View>
    </Pressable>
  );
};
