import React from 'react';
import { View, Text, type StyleProp, type ViewStyle } from 'react-native';
import type { NativeBaseProps } from '@/types/native-base-props';
import { useFormGroupContext } from '../../FormGroupContext';
import { UtilityBody } from '@/components/Typography/Utility/UtilityBody/native/UtilityBody.native';
import { useNativeStyles } from '@/hooks/useNativeStyles';

export interface FormGroupDescriptionNativeProps extends NativeBaseProps {
  children: React.ReactNode;
  id?: string;
  style?: StyleProp<ViewStyle>;
}

export const FormGroupDescription: React.FC<FormGroupDescriptionNativeProps> = ({
  children,
  id: idProp,
  dataTestId,
  style,
}) => {
  const context = useFormGroupContext();
  const resolvedId = idProp ?? context?.descriptionId;
  const styles = useNativeStyles((theme) => ({
    root: {
      marginTop: theme.spacing2,
      marginBottom: theme.spacing8,
    },
    text: {
      color: theme.colorTextOnLightSecondary,
    },
  }));

  return (
    <View nativeID={resolvedId} style={[styles.root, style]} testID={dataTestId}>
      <UtilityBody size="x-small" weight="regular">
        <Text style={styles.text}>{children}</Text>
      </UtilityBody>
    </View>
  );
};
