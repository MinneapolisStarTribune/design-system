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
      alignSelf: 'flex-start',
    },

    pressable: {
      flexDirection: 'row',
      alignItems: 'flex-start',
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
      marginTop: theme.spacing2,
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
      color: theme.colorTextOnLightTertiary,
      marginTop: theme.spacing4,
    },

    // Border colors
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

    // Dot colors
    dotUnchecked: {
      backgroundColor: theme.colorRadioDotUnchecked,
    },

    dotNeutral: {
      backgroundColor: theme.colorRadioDotSelectedNeutral,
    },

    dotBrand: {
      backgroundColor: theme.colorRadioDotSelectedBrand,
    },
  });
}

/**
 * Radio component for selecting a single option in a set.
 * React Native implementation matching the web version.
 */
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
      createDesignSystemError('Radio', 'must be used within a DesignSystemProvider.')
    );
  }

  const styles = useNativeStyles(createStyles);

  const handlePress = () => {
    if (disabled || checked) return;
    onChange(true);
  };

  // Determine border color based on state
  const getBorderStyle = () => {
    if (error) return styles.borderError;
    if (checked) {
      return color === 'brand' ? styles.borderCheckedBrand : styles.borderCheckedNeutral;
    }
    return styles.borderUnchecked;
  };

  // Determine dot color based on state
  const getDotStyle = () => {
    if (checked) {
      return color === 'brand' ? styles.dotBrand : styles.dotNeutral;
    }
    return styles.dotUnchecked;
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      accessibilityHint={description}
      testID={dataTestId}
      style={[styles.root, disabled && styles.disabled]}
      android_ripple={{ color: 'transparent' }}
    >
      <View style={styles.pressable}>
        {/* Visual radio button */}
        <View style={[styles.visualDot, getBorderStyle()]}>
          {checked && <View style={[styles.dot, getDotStyle()]} />}
        </View>

        {/* Label and description */}
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
