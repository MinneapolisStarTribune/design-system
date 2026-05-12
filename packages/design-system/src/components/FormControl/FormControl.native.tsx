import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  type TextInput as RNTextInputRef,
  View,
  type NativeSyntheticEvent,
  type StyleProp,
  type TextInputFocusEventData,
  type TextInputProps as RNTextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useFormGroupContext } from '@/components/FormGroup/FormGroupContext';
import { useNativeStyles, type NativeTheme } from '@/hooks/useNativeStyles';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
import type { AccessibilityProps } from '@/types/globalTypes';
import type { NativeBaseProps } from '@/types/native-base-props';
import { Size } from '@/types/globalTypes';
import { Select } from './Select/native/Select.native';
import {
  fieldSurfaceBorderWidth,
  getFieldSurfaceColors,
  getFieldSurfaceTokens,
} from '@/utils/fieldSurface';

export type FormControlSize = Extract<Size, 'small' | 'medium' | 'large'>;

export interface FormControlProps extends NativeBaseProps {
  size?: FormControlSize;
  isDisabled?: boolean;
}

function readTypography(theme: NativeTheme, key: keyof NativeTheme): TextStyle {
  const v = theme[key];
  return v != null && typeof v === 'object' ? (v as TextStyle) : {};
}

function readSpacing(theme: NativeTheme, key: keyof NativeTheme): number {
  const v = theme[key];
  return typeof v === 'number' ? v : 0;
}

type SizeKey = FormControlSize;

const SIZE_LAYOUT: Record<
  SizeKey,
  {
    minHeight: keyof NativeTheme;
    paddingV: keyof NativeTheme;
    paddingH: keyof NativeTheme;
    gap: keyof NativeTheme;
    typoValue: keyof NativeTheme;
  }
> = {
  small: {
    minHeight: 'spacingInputSm',
    paddingV: 'spacing8',
    paddingH: 'spacing12',
    gap: 'spacing8',
    typoValue: 'typographyUtilityTextMediumSmall',
  },
  medium: {
    minHeight: 'spacingInputMd',
    paddingV: 'spacing12',
    paddingH: 'spacing16',
    gap: 'spacing8',
    typoValue: 'typographyUtilityTextMediumMedium',
  },
  large: {
    minHeight: 'spacingInputLg',
    paddingV: 'spacing12',
    paddingH: 'spacing16',
    gap: 'spacing8',
    typoValue: 'typographyUtilityTextMediumLarge',
  },
};

interface FormControlTextInputProps
  extends FormControlProps,
    Omit<RNTextInputProps, 'editable' | 'testID'>,
    AccessibilityProps {
  placeholderText?: string;
  /** Optional decorative icon (e.g. search icon). */
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  rounded?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  style?: StyleProp<ViewStyle>;
}

const FormControlTextInput = React.forwardRef<RNTextInputRef, FormControlTextInputProps>(
  function FormControlTextInput(props, ref) {
    const {
      placeholderText,
      placeholder,
      size = 'medium',
      isDisabled = false,
      isError: isErrorProp = false,
      isSuccess: isSuccessProp = false,
      rounded = false,
      icon,
      iconPosition = 'end',
      dataTestId,
      style: wrapperStyleProp,
      value,
      defaultValue,
      onFocus,
      onBlur,
      id: idProp,
      ...rest
    } = props;

    const dsContext = useContext(DesignSystemContext);
    const isDark = dsContext?.colorScheme === 'dark';

    const formGroupContext = useFormGroupContext();
    const [focused, setFocused] = useState(false);

    const hasError = isErrorProp || formGroupContext?.hasError === true;
    const hasSuccess = (isSuccessProp || formGroupContext?.hasSuccess === true) && !hasError;
    const nativeInputId = idProp ?? formGroupContext?.inputId;

    const isFilled =
      (value != null && String(value).trim().length > 0) ||
      (defaultValue != null && String(defaultValue).trim().length > 0);

    const layout = SIZE_LAYOUT[size];

    const fieldSurfaceTokens = useNativeStyles(
      useCallback((theme: NativeTheme) => getFieldSurfaceTokens(theme), [])
    );

    const {
      wrapper: wrapperStatic,
      inputBase,
      iconSlot,
    } = useNativeStyles(
      useCallback(
        (theme: NativeTheme) => {
          const pv = readSpacing(theme, layout.paddingV);
          const ph = readSpacing(theme, layout.paddingH);
          const gap = readSpacing(theme, layout.gap);
          const minHeight = readSpacing(theme, layout.minHeight);
          const borderRadius = rounded ? theme.radiusFull : theme.radius4;

          return StyleSheet.create({
            wrapper: {
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              minWidth: 0,
              borderWidth: fieldSurfaceBorderWidth,
              borderRadius,
              minHeight,
              paddingVertical: pv,
              paddingHorizontal: ph,
              columnGap: gap,
            },
            inputBase: {
              flex: 1,
              minWidth: 0,
              padding: 0,
              margin: 0,
              backgroundColor: 'transparent',
              borderWidth: 0,
              ...readTypography(theme, layout.typoValue),
            },
            iconSlot: {
              flexShrink: 0,
            },
          });
        },
        [layout, rounded]
      )
    );

    const { borderColor, backgroundColor, textColor, placeholderTextColor } = useMemo(
      () =>
        getFieldSurfaceColors(fieldSurfaceTokens, {
          isDark,
          isDisabled,
          hasError,
          hasSuccess,
          focused,
          isFilled,
        }),
      [fieldSurfaceTokens, focused, hasError, hasSuccess, isDark, isDisabled, isFilled]
    );

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(false);
      onBlur?.(e);
    };

    const leftIcon = icon && iconPosition === 'start' ? icon : null;
    const rightIcon = icon && iconPosition === 'end' ? icon : null;

    return (
      <View style={[wrapperStatic, { borderColor, backgroundColor }, wrapperStyleProp]}>
        {leftIcon ? <View style={iconSlot}>{leftIcon}</View> : null}
        <RNTextInput
          ref={ref}
          nativeID={nativeInputId}
          placeholder={placeholderText ?? placeholder}
          placeholderTextColor={placeholderTextColor}
          editable={!isDisabled}
          testID={dataTestId}
          value={value}
          defaultValue={defaultValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[inputBase, { color: textColor }]}
          underlineColorAndroid="transparent"
          accessibilityState={{ disabled: isDisabled }}
          {...rest}
        />
        {rightIcon ? <View style={iconSlot}>{rightIcon}</View> : null}
      </View>
    );
  }
);

FormControlTextInput.displayName = 'FormControl.TextInput';

export const FormControl: React.FC<FormControlProps> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TextInput: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Select: React.ComponentType<any>;
} = () => {
  if (typeof console !== 'undefined' && console.error) {
    console.error(
      'FormControl must be used with a subcomponent (e.g., FormControl.TextInput). ' +
        'Use <FormControl.TextInput /> instead of <FormControl />.'
    );
  }
  return null;
};

FormControl.TextInput = FormControlTextInput;
FormControl.Select = Select;
