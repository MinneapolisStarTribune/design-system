import React from 'react';
import { Pressable, Text, View, type GestureResponderEvent } from 'react-native';
import { useNativeStyles } from '@/hooks/useNativeStyles';
import { UtilityBody } from '@/components/Typography/Utility/UtilityBody/native/UtilityBody.native';
import { createStyles } from './Link.styles';
import { enhanceLinkIconNative, getLinkIconViewportPx } from '../Link.helpers';
import {
  LINK_SIZE_TO_UTILITY_BODY_TOKEN,
  type LinkUtilityProps,
  type LinkInlineProps,
} from '../Link.types';

import type { NativeTextStylingProps, NativeViewStylingProps } from '@/types';

type OmitWebProps<T> = Omit<T, 'href' | 'as' | 'onClick' | 'className' | 'style' | 'children'>;

type InlineNativeProps = NativeTextStylingProps<OmitWebProps<LinkInlineProps>>;

type UtilityNativeProps = NativeViewStylingProps<OmitWebProps<LinkUtilityProps>>;

type CommonProps = {
  onPress?: (event: GestureResponderEvent) => void;
  testID?: string;
};

export type NativeLinkInlineProps = InlineNativeProps &
  CommonProps & {
    variant: 'inline';
    children: string;
  };

export type NativeLinkUtilityProps = UtilityNativeProps &
  CommonProps & {
    variant: 'utility';
    children: React.ReactNode;
  };

export type LinkProps = NativeLinkInlineProps | NativeLinkUtilityProps;

export const Link: React.FC<LinkProps> = (props) => {
  const { styles } = useNativeStyles((t) => ({
    styles: createStyles(t),
  }));

  // Inline Variant
  if (props.variant === 'inline') {
    const {
      children,
      onPress,
      disabled,
      style,
      dataTestId,
      testID,
      'aria-label': ariaLabel,
      id,
    } = props;

    const baseStyle = disabled ? styles.inlineTextDisabled : styles.inlineText;

    return (
      <Text
        accessibilityRole="link"
        accessibilityState={{ disabled: !!disabled }}
        onPress={disabled ? undefined : onPress}
        style={[baseStyle, style]}
        testID={testID ?? dataTestId}
        accessibilityLabel={ariaLabel}
        nativeID={id}
      >
        {children}
      </Text>
    );
  }

  // Utility Variant
  const {
    children,
    size = 'medium',
    icon,
    iconPosition = 'end',
    disabled,
    onPress,
    dataTestId,
    testID,
    'aria-label': ariaLabel,
    id,
  } = props;

  const utilityBodySize = LINK_SIZE_TO_UTILITY_BODY_TOKEN[size];
  const textStyle = disabled ? styles.textDisabled : styles.text;
  const iconViewportPx = icon ? getLinkIconViewportPx(icon) : 0;
  const iconViewportStyle = { width: iconViewportPx, height: iconViewportPx };

  const renderIcon = (position: 'start' | 'end') => {
    if (!icon || iconPosition !== position || !React.isValidElement(icon)) return null;
    return (
      <View style={[styles.icon, iconViewportStyle]}>
        {enhanceLinkIconNative(icon, textStyle.color as string)}
      </View>
    );
  };

  const content = (
    <>
      {renderIcon('start')}
      <UtilityBody size={utilityBodySize} weight="medium" style={textStyle}>
        {children}
      </UtilityBody>
      {renderIcon('end')}
    </>
  );

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      testID={testID ?? dataTestId}
      accessibilityLabel={ariaLabel}
      nativeID={id}
      style={({ pressed }) => [
        styles.row,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {content}
    </Pressable>
  );
};

Link.displayName = 'Link';
