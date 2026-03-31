import { View, Text, type StyleProp, type ViewStyle } from 'react-native';
import { BaseProps } from '@/types/globalTypes';
import { useFormGroupContext } from '../../FormGroupContext';
import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/native/UtilityLabel.native';
import { UtilityBody } from '@/components/Typography/Utility/UtilityBody/native/UtilityBody.native';
import { useNativeStyles } from '@/hooks/useNativeStyles';

export interface FormGroupLabelProps extends Omit<BaseProps, 'style'> {
  children: React.ReactNode;
  element?: string;
  id?: string;
  htmlFor?: string;
  optional?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const FormGroupLabel: React.FC<FormGroupLabelProps> = ({
  children,
  dataTestId,
  id: idProp,
  optional = false,
  style,
}) => {
  const context = useFormGroupContext();
  const resolvedId = idProp ?? context?.labelId;
  const optionalTextStyle = useNativeStyles((theme) => ({
    color: theme.colorTextOnLightTertiary,
  }));

  return (
    <View
      style={[{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', gap: 4 }, style]}
    >
      <UtilityLabel id={resolvedId} size="medium" weight="semibold" dataTestId={dataTestId}>
        {children}
      </UtilityLabel>
      {optional && (
        <UtilityBody size="xx-small" weight="regular">
          <Text style={optionalTextStyle}>(Optional)</Text>
        </UtilityBody>
      )}
    </View>
  );
};
