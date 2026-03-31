import { Text, type StyleProp, TextStyle } from 'react-native';
import { BaseProps } from '@/types/globalTypes';
import { useFormGroupContext } from '../../FormGroupContext';

export interface FormGroupLabelProps extends Omit<BaseProps, 'style'> {
  children: React.ReactNode;
  element?: string;
  id?: string;
  htmlFor?: string;
  optional?: boolean;
  style?: StyleProp<TextStyle>;
}

export const FormGroupLabel: React.FC<FormGroupLabelProps> = ({
  children,
  dataTestId,
  id,
  optional = false,
  style,
}) => {
  const context = useFormGroupContext();
  const resolvedId = id ?? context?.labelId;
  return (
    <Text style={style} testID={dataTestId} id={resolvedId}>
      {children}
      {optional ? ' (Optional)' : ''}
    </Text>
  );
};
