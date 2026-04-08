import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View, type TextStyle } from 'react-native';
import type { ToastNativeProps, ToastVariant } from '@/components/Toast/Toast.types';
import { useNativeStyles, type NativeTheme } from '@/hooks/useNativeStyles';

/** Unicode stand-ins for web SVG icons (no react-native-svg in this package). */
const VARIANT_ICON_CHAR: Record<ToastVariant, string> = {
  info: '\u2139',
  success: '\u2713',
  warning: '\u26a0',
  error: '\u2715',
};

type VariantPalette = {
  background: string;
  border: string;
  title: string;
  description: string;
  icon: string;
  close: string;
};

function getVariantPalette(theme: NativeTheme, variant: ToastVariant): VariantPalette {
  switch (variant) {
    case 'info':
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
  onClose,
  dataTestId = 'toast-native',
}) => {
  const styles = useNativeStyles(createToastNativeStyles);
  const paletteFactory = useCallback(
    (theme: NativeTheme) => getVariantPalette(theme, variant),
    [variant]
  );
  const palette = useNativeStyles(paletteFactory);

  const isError = variant === 'error';

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
        },
      ]}
      testID={dataTestId}
      accessibilityRole={isError ? 'alert' : undefined}
      accessibilityLiveRegion={isError ? 'assertive' : 'polite'}
    >
      <View style={styles.content}>
        {showIcon ? (
          <Text
            style={[styles.icon, { color: palette.icon }]}
            accessibilityElementsHidden
            importantForAccessibility="no"
          >
            {VARIANT_ICON_CHAR[variant]}
          </Text>
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
          <Text style={[styles.closeGlyph, { color: palette.close }]}>×</Text>
        </Pressable>
      ) : null}
    </View>
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
    icon: {
      marginTop: 1,
      width: 20,
      textAlign: 'center',
      ...t.typographyUtilityLabelSemiboldLarge,
      fontSize: 16,
      lineHeight: 20,
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
    closeGlyph: {
      fontSize: 18,
      lineHeight: 20,
    },
  });
}
