import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/native/UtilityLabel.native';
import { useNativeStyles } from '@/hooks/useNativeStyles';
import type { NativeTheme } from '@/hooks/useNativeStyles';
import { createDesignSystemError } from '@/utils/errorPrefix';
import { enhanceButtonIconNative, getButtonAriaLabel, getButtonIconSize } from '../Helpers';
import type { ButtonNativeProps, ButtonSize } from '../Button.types';
import { getNativeButtonSurface } from './buttonTheme';

const MIN_TOUCH = 44;

function hitSlopForSize(width: number, height: number) {
  const v = height < MIN_TOUCH ? (MIN_TOUCH - height) / 2 : 0;
  const h = width < MIN_TOUCH ? (MIN_TOUCH - width) / 2 : 0;
  return { top: v, bottom: v, left: h, right: h };
}

function createLayout(theme: NativeTheme, size: ButtonSize | 'x-small', isIconOnly: boolean) {
  if (isIconOnly) {
    const map: Record<string, { w: number; h: number; p: number }> = {
      large: { w: 44, h: 44, p: theme.spacing6 },
      medium: { w: 40, h: 40, p: theme.spacing8 },
      small: { w: 32, h: 32, p: theme.spacing6 },
      'x-small': { w: 24, h: 24, p: theme.spacing4 },
    };
    const d = map[size] ?? map.medium;
    return {
      width: d.w,
      height: d.h,
      paddingHorizontal: d.p,
      paddingVertical: d.p,
      borderRadius: theme.radiusFull,
    };
  }

  const heights: Record<ButtonSize, number> = {
    small: 32,
    medium: 40,
    large: 52,
  };
  const padX: Record<ButtonSize, number> = {
    small: theme.spacing12,
    medium: theme.spacing16,
    large: theme.spacing24,
  };
  const s = size as ButtonSize;
  return {
    minHeight: heights[s],
    paddingHorizontal: padX[s],
    borderRadius: theme.radiusFull,
  };
}

export const Button: React.FC<ButtonNativeProps> = ({
  color = 'neutral',
  capitalize = false,
  variant = 'filled',
  size = 'medium',
  icon,
  iconPosition = 'end',
  children,
  isDisabled,
  isLoading = false,
  onPress,
  style,
  testID = 'button',
  accessibilityLabel: accessibilityLabelProp,
  accessibilityHint,
}) => {
  const hasAnyIcon = !!icon;
  const isIconOnly = hasAnyIcon && !children;

  if (size === 'x-small' && !isIconOnly) {
    throw new Error(
      createDesignSystemError(
        'Button',
        'x-small size is only valid for icon-only buttons. Remove text children or use a different size.'
      )
    );
  }

  const { theme, layout, labelSize, hitSlop } = useNativeStyles((t) => {
    const lay = createLayout(t, size, isIconOnly);
    const w = typeof lay.width === 'number' ? lay.width : 160;
    const h = typeof lay.height === 'number' ? lay.height : (lay.minHeight ?? 40);
    return {
      theme: t,
      layout: lay,
      labelSize: (size === 'x-small' ? 'small' : size) as ButtonSize,
      hitSlop: hitSlopForSize(w, h),
    };
  });

  const accessibilityLabel = accessibilityLabelProp ?? getButtonAriaLabel(undefined, children);

  const iconSizeName = hasAnyIcon ? getButtonIconSize(size, isIconOnly) : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!(isDisabled || isLoading) }}
      disabled={isDisabled || isLoading}
      onPress={onPress}
      hitSlop={hitSlop}
      testID={testID}
      style={({ pressed }) => {
        const showPressed = pressed && !isDisabled && !isLoading;
        const surface = getNativeButtonSurface(theme, color, variant, showPressed);
        const row: ViewStyle = {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          ...layout,
          backgroundColor: surface.backgroundColor,
          borderWidth: surface.borderWidth ?? 0,
          borderColor: surface.borderColor,
          opacity: isDisabled || isLoading ? 0.4 : 1,
        };
        if (!isIconOnly && hasAnyIcon) {
          row.gap = theme.spacing4;
        }
        return [row, style as StyleProp<ViewStyle>];
      }}
    >
      {({ pressed }) => {
        const showPressed = pressed && !isDisabled && !isLoading;
        const surface = getNativeButtonSurface(theme, color, variant, showPressed);

        const leftIcon =
          isIconOnly || iconPosition === 'start'
            ? enhanceButtonIconNative(icon, iconSizeName, surface.color)
            : null;
        const rightIcon =
          !isIconOnly && iconPosition === 'end'
            ? enhanceButtonIconNative(icon, iconSizeName, surface.color)
            : null;

        return (
          <View style={nativeStyles.inner}>
            {isLoading ? (
              <ActivityIndicator color={surface.color} />
            ) : (
              <>
                {leftIcon}
                {!isIconOnly && (
                  <UtilityLabel
                    size={labelSize}
                    weight="semibold"
                    capitalize={capitalize}
                    style={{ color: surface.color }}
                  >
                    {children}
                  </UtilityLabel>
                )}
                {rightIcon}
              </>
            )}
          </View>
        );
      }}
    </Pressable>
  );
};

Button.displayName = 'Button';

const nativeStyles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export type { ButtonNativeProps } from '../Button.types';
