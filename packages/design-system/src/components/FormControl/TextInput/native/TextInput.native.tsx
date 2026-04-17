import React, { useContext, useMemo, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
  TextInputFocusEventData,
  View,
} from 'react-native';
import { BaseTextInputProps } from '../TextInput.types';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SuccessIcon, useFormGroupContext, useNativeStyles } from '@/index.native';
import { NativeTheme } from '@/hooks/useNativeStyles';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
import { getFieldSurfaceColors, getFieldSurfaceTokens } from '@/utils/fieldSurface';
import { createStyles, getInputTypographyStyleKey, getRoundedStyleKey } from './TextInput.styles';

export interface TextInputProps
  extends Omit<BaseTextInputProps, 'style'>,
    Omit<RNTextInputProps, 'style' | 'testID'> {}

const createTextInputThemeState = (theme: NativeTheme) => ({
  styles: createStyles(theme),
  fieldSurfaceTokens: getFieldSurfaceTokens(theme),
});

export const TextInput: React.FC<TextInputProps> = ({
  size = 'small',
  placeholderText,
  icon,
  iconPosition = 'end',
  rounded = false,
  isDisabled = false,
  isError,
  isSuccess,
  value,
  onChangeText,
  onBlur,
  onFocus,
  dataTestId = 'text-input',
  analytics,
  accessibilityLabel,
  accessibilityHint,
  ...props
}) => {
  const { track } = useAnalytics();
  const { styles, fieldSurfaceTokens } = useNativeStyles(createTextInputThemeState);
  const dsContext = useContext(DesignSystemContext);
  const isDark = dsContext?.colorScheme === 'dark';
  const formGroupContext = useFormGroupContext();
  const inputRef = useRef<RNTextInput>(null);

  const [isFocused, setIsFocused] = useState(false);

  // Error/success state: use prop when provided, else fall back to FormGroup context
  const hasError = isError ?? formGroupContext?.hasError ?? false;
  const hasSuccess = isSuccess ?? formGroupContext?.hasSuccess ?? false;
  const isFilled = value != null && String(value).trim().length > 0;
  const inputTypographyStyle = styles[getInputTypographyStyleKey(size, isFilled)];
  const roundedSizeStyle = styles[getRoundedStyleKey(size)];
  const { borderColor, backgroundColor, textColor, placeholderTextColor } = useMemo(
    () =>
      getFieldSurfaceColors(fieldSurfaceTokens, {
        isDark,
        isDisabled,
        hasError,
        hasSuccess,
        focused: isFocused,
        isFilled,
      }),
    [fieldSurfaceTokens, hasError, hasSuccess, isDark, isDisabled, isFilled, isFocused]
  );

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    track({
      event: 'text_input_blur',
      component: 'TextInput',
      value_length: value ? String(value).length : 0,
      ...analytics,
    });
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const leftIcon = icon && iconPosition === 'start' ? icon : null;
  const rightIcon = icon && iconPosition === 'end' ? icon : null;
  const showSuccessIcon = hasSuccess && !hasError;

  return (
    <Pressable
      accessibilityElementsHidden
      accessible={false}
      disabled={isDisabled}
      onPress={() => inputRef.current?.focus()}
      style={[
        styles.wrapper,
        styles[size],
        { borderColor, backgroundColor },
        rounded && styles.rounded,
        rounded && roundedSizeStyle,
        isFocused && styles.focused,
      ]}
      testID={dataTestId ? `${dataTestId}-wrapper` : undefined}
    >
      {leftIcon && (
        <View
          pointerEvents="none"
          style={[styles.iconContainer]}
          testID={`${dataTestId}-icon-start`}
        >
          {leftIcon}
        </View>
      )}

      <RNTextInput
        ref={inputRef}
        style={[
          styles.input,
          inputTypographyStyle,
          isDisabled && styles.inputDisabled,
          { color: textColor },
        ]}
        placeholder={placeholderText}
        placeholderTextColor={placeholderTextColor}
        editable={!isDisabled}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={hasError ? 'Input has error' : accessibilityHint}
        accessibilityState={{ disabled: isDisabled }}
        testID={dataTestId}
        {...props}
      />

      {rightIcon && (
        <View pointerEvents="none" style={[styles.iconContainer]} testID={`${dataTestId}-icon-end`}>
          {rightIcon}
        </View>
      )}

      {showSuccessIcon && (
        <View
          pointerEvents="none"
          style={[styles.iconContainer]}
          testID={`${dataTestId}-icon-success`}
        >
          <SuccessIcon color="brand-01" />
        </View>
      )}
    </Pressable>
  );
};
