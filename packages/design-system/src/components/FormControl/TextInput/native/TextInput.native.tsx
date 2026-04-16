import React, { useRef, useState } from 'react';
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
import { useFormGroupContext, useNativeStyles } from '@/index.native';
import { NativeTheme } from '@/hooks/useNativeStyles';
import {
  createStyles,
  getInputTypographyStyleKey,
  getPlaceholderTextColor,
  getRoundedStyleKey,
} from './TextInput.styles';
import { SuccessIcon } from '@/icons';

export interface TextInputProps
  extends Omit<BaseTextInputProps, 'style' | 'dataTestId'>,
    Omit<RNTextInputProps, 'style'> {}

const createTextInputThemeState = (theme: NativeTheme) => ({
  styles: createStyles(theme),
  placeholderTextColor: getPlaceholderTextColor(theme),
  successIconFill: theme.colorBorderBrand01,
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
  testID = 'text-input',
  analytics,
  accessibilityLabel,
  accessibilityHint,
  ...props
}) => {
  const { track } = useAnalytics();
  const { styles, placeholderTextColor, successIconFill } = useNativeStyles(createTextInputThemeState);
  const formGroupContext = useFormGroupContext();
  const inputRef = useRef<RNTextInput>(null);

  const [isFocused, setIsFocused] = useState(false);

  // Error/success state: use prop when provided, else fall back to FormGroup context
  const hasError = isError ?? formGroupContext?.hasError ?? false;
  const hasSuccess = isSuccess ?? formGroupContext?.hasSuccess ?? false;
  const isFilled = value != null && String(value).trim().length > 0;
  const inputTypographyStyle = styles[getInputTypographyStyleKey(size, isFilled)];
  const roundedSizeStyle = styles[getRoundedStyleKey(size)];

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
        rounded && styles.rounded,
        rounded && roundedSizeStyle,
        isDisabled && styles.disabled,
        hasError && styles.error,
        hasSuccess && styles.success,
        isFocused && styles.focused,
        isFilled && styles.filled,
      ]}
      testID={testID ? `${testID}-wrapper` : undefined}
    >
      {leftIcon && (
        <View pointerEvents="none" style={[styles.iconContainer]} testID={`${testID}-icon-start`}>
          {leftIcon}
        </View>
      )}

      <RNTextInput
        ref={inputRef}
        style={[styles.input, inputTypographyStyle, isDisabled && styles.inputDisabled]}
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
        testID={testID}
        {...props}
      />

      {rightIcon && (
        <View pointerEvents="none" style={[styles.iconContainer]} testID={`${testID}-icon-end`}>
          {rightIcon}
        </View>
      )}

      {showSuccessIcon && (
        <View pointerEvents="none" style={[styles.iconContainer]} testID={`${testID}-icon-success`}>
          <SuccessIcon fill={successIconFill} />
        </View>
      )}
    </Pressable>
  );
};
