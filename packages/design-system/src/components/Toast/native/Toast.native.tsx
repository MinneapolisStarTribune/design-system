import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, type TextStyle } from 'react-native';
import type { ToastNativeProps, ToastVariant } from '@/components/Toast/Toast.types';
import { useNativeStyles, type NativeTheme } from '@/hooks/useNativeStyles';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
import { createDesignSystemError } from '@/utils/errorPrefix';

import {
  ToastCloseIcon,
  ToastErrorIcon,
  ToastInformationIcon,
  ToastSuccessIcon,
  ToastWarningIcon,
} from './ToastIcons.native';

/** Same variant → icon mapping as web `Toast.tsx` (`InformationIcon`, `SuccessIcon`, etc.). */
const VARIANT_ICON = {
  info: ToastInformationIcon,
  success: ToastSuccessIcon,
  warning: ToastWarningIcon,
  error: ToastErrorIcon,
} as const;

type VariantPalette = {
  background: string;
  border: string;
  title: string;
  description: string;
  icon: string;
  close: string;
};

function getVariantPalette(
  theme: NativeTheme,
  variant: ToastVariant,
  isDark: boolean
): VariantPalette {
  switch (variant) {
    case 'info':
      if (isDark) {
        return {
          background: theme.colorSemanticInfoBackground,
          border: withAlphaSuffix(theme.colorSemanticInfoForeground, '40'),
          title: theme.colorSemanticInfoForeground,
          description: theme.colorSemanticInfoForeground,
          icon: theme.colorSemanticInfoForeground,
          close: theme.colorSemanticInfoForeground,
        };
      }
      return {
        background: theme.colorBackgroundLightGray01,
        border: theme.colorBorderOnLightSubtle01,
        title: theme.colorIconOnLightPrimary,
        description: theme.colorTextOnLightSecondary,
        icon: theme.colorIconOnLightPrimary,
        close: theme.colorIconOnLightPrimary,
      };
    case 'success':
      return {
        background: theme.colorSemanticSuccessBackground,
        border: withAlphaSuffix(theme.colorSemanticSuccessForeground, '40'),
        title: theme.colorSemanticSuccessForeground,
        description: theme.colorSemanticSuccessForeground,
        icon: theme.colorSemanticSuccessForeground,
        close: theme.colorSemanticSuccessForeground,
      };
    case 'warning':
      return {
        background: theme.colorSemanticWarningBackground,
        border: withAlphaSuffix(theme.colorSemanticWarningForeground, '40'),
        title: theme.colorSemanticWarningForeground,
        description: theme.colorSemanticWarningForeground,
        icon: theme.colorSemanticWarningForeground,
        close: theme.colorSemanticWarningForeground,
      };
    case 'error':
      return {
        background: theme.colorSemanticErrorBackground,
        border: withAlphaSuffix(theme.colorSemanticErrorForeground, '40'),
        title: theme.colorSemanticErrorForeground,
        description: theme.colorSemanticErrorForeground,
        icon: theme.colorSemanticErrorForeground,
        close: theme.colorSemanticErrorForeground,
      };
  }
}

/** Appends two hex digits of alpha (~25% when `aa` is `40`) to a `#rrggbb` color. */
function withAlphaSuffix(hex: string, aa: string): string {
  if (hex.startsWith('#') && hex.length === 7) {
    return `${hex}${aa}`;
  }
  return hex;
}

export const ToastNative: React.FC<ToastNativeProps> = ({
  title,
  description,
  variant = 'info',
  showIcon = true,
  showCloseButton = true,
  exiting = false,
  onClose,
  dataTestId = 'toast-native',
}) => {
  const designSystemContext = useContext(DesignSystemContext);
  if (!designSystemContext) {
    throw new Error(
      createDesignSystemError('ToastNative', 'must be used within a DesignSystemProvider.')
    );
  }
  const isDark = designSystemContext.colorScheme === 'dark';

  const styles = useNativeStyles(createToastNativeStyles);
  const paletteFactory = useCallback(
    (theme: NativeTheme) => getVariantPalette(theme, variant, isDark),
    [variant, isDark]
  );
  const palette = useNativeStyles(paletteFactory);
  const VariantIcon = VARIANT_ICON[variant];
  const [exitProgress] = useState(() => new Animated.Value(exiting ? 1 : 0));

  const isError = variant === 'error';

  useEffect(() => {
    Animated.timing(exitProgress, {
      toValue: exiting ? 1 : 0,
      duration: 120,
      useNativeDriver: false,
    }).start();
  }, [exiting, exitProgress]);

  return (
    <Animated.View
      style={[
        styles.root,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
          opacity: exitProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
          transform: [
            {
              translateY: exitProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 8],
              }),
            },
          ],
        },
      ]}
      testID={dataTestId}
      accessibilityRole={isError ? 'alert' : undefined}
      accessibilityLiveRegion={isError ? 'assertive' : 'polite'}
    >
      <View style={styles.content}>
        {showIcon ? (
          <View style={styles.iconWrap} accessibilityElementsHidden importantForAccessibility="no">
            <VariantIcon color={palette.icon} />
          </View>
        ) : null}
        <View style={styles.textColumn}>
          <Text style={[styles.title, { color: palette.title }]}>{title}</Text>
          {description ? (
            <Text style={[styles.description, { color: palette.description }]}>{description}</Text>
          ) : null}
        </View>
      </View>
      {showCloseButton ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
          onPress={onClose}
          style={({ pressed }) => [
            styles.closePressable,
            pressed && { backgroundColor: withAlphaSuffix(palette.close, '1f') },
          ]}
        >
          <ToastCloseIcon color={palette.close} />
        </Pressable>
      ) : null}
    </Animated.View>
  );
};

function createToastNativeStyles(theme: NativeTheme) {
  const t = theme as NativeTheme & Record<string, TextStyle>;
  return StyleSheet.create({
    root: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      width: '100%',
      maxWidth: 372,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 4,
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      minWidth: 0,
    },
    iconWrap: {
      marginTop: 1,
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textColumn: {
      flex: 1,
      flexDirection: 'column',
      gap: 4,
      minWidth: 0,
    },
    title: {
      ...t.typographyUtilityLabelSemiboldLarge,
    },
    description: {
      ...t.typographyUtilityTextRegularSmall,
    },
    closePressable: {
      marginTop: -2,
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
    },
  });
}
