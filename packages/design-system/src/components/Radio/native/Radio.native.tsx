import React, { useContext } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/native/UtilityLabel.native';
import { UtilityBody } from '@/components/Typography/Utility/UtilityBody/native/UtilityBody.native';

import { useNativeStyles, type NativeTheme } from '@/hooks/useNativeStyles';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
import { createDesignSystemError } from '@/utils/errorPrefix';

import { RadioProps } from '../Radio.types';

function createStyles(theme: NativeTheme) {
  const radioSize = theme.spacingRadioDefault;
  const dotSize = theme.spacingRadioSmall;

  return StyleSheet.create({
    root: {
      alignItems: 'flex-start',
    },

    pressable: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    disabled: {
      opacity: 0.4,
    },

    visualDot: {
      width: radioSize,
      height: radioSize,
      borderRadius: radioSize / 2,
      borderWidth: 1,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },

    dot: {
      width: dotSize,
      height: dotSize,
      borderRadius: dotSize / 2,
    },

    content: {
      flexDirection: 'column',
      marginLeft: theme.spacing8,
      flexShrink: 1,
    },

    title: {
      color: theme.colorTextOnLightPrimary,
    },

    description: {
      marginTop: theme.spacing4,
      color: theme.colorTextOnLightTertiary,
    },

    borderUnchecked: {
      borderColor: theme.colorRadioBorderUnchecked,
    },

    borderCheckedNeutral: {
      borderColor: theme.colorRadioBorderSelectedNeutral,
    },

    borderCheckedBrand: {
      borderColor: theme.colorRadioBorderSelectedBrand,
    },

    borderError: {
      borderColor: theme.colorBorderStateAttentionOnLight,
    },

    dotNeutral: {
      backgroundColor: theme.colorRadioDotSelectedNeutral,
    },

    dotBrand: {
      backgroundColor: theme.colorRadioDotSelectedBrand,
    },

    dotUnchecked: {
      backgroundColor: theme.colorRadioDotUnchecked,
    },
  });
}

export const Radio: React.FC<RadioProps> = ({
  label,
  description,
  checked,
  color = 'neutral',
  disabled = false,
  error = false,
  onChange,
  dataTestId,
}) => {
  const context = useContext(DesignSystemContext);

  if (!context) {
    throw new Error(
      createDesignSystemError('RadioNative', 'must be used within a DesignSystemProvider.')
    );
  }

  const styles = useNativeStyles(createStyles);

  const handlePress = () => {
    if (disabled || checked) return;
    onChange(true);
  };

  const borderStyle = [
    styles.visualDot,
    error
      ? styles.borderError
      : checked
        ? color === 'brand'
          ? styles.borderCheckedBrand
          : styles.borderCheckedNeutral
        : styles.borderUnchecked,
  ];

  const dotStyle = [
    styles.dot,
    checked ? (color === 'brand' ? styles.dotBrand : styles.dotNeutral) : styles.dotUnchecked,
  ];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked, disabled }}
      testID={dataTestId}
      style={[styles.root, disabled && styles.disabled]}
      android_ripple={null} // ✅ FIX: remove square ripple completely
    >
      <View style={styles.pressable}>
        <View style={borderStyle}>
          <View style={dotStyle} />
        </View>

        <View style={styles.content}>
          <UtilityLabel size="medium" weight="regular" style={styles.title}>
            {label}
          </UtilityLabel>

          {description ? (
            <UtilityBody size="x-small" weight="regular" style={styles.description}>
              {description}
            </UtilityBody>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

Radio.displayName = 'Radio';
