import { View, Text, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { BaseProps } from '@/types/globalTypes';
import { useFormGroupContext } from '../../FormGroupContext';
import { UtilityBody } from '@/components/Typography/Utility/UtilityBody/native/UtilityBody.native';
import { useNativeStyles } from '@/hooks/useNativeStyles';

export const FORM_GROUP_CAPTION_VARIANTS = ['info', 'error', 'success'] as const;
export type FormGroupCaptionVariant = (typeof FORM_GROUP_CAPTION_VARIANTS)[number];

export interface FormGroupCaptionProps extends Omit<BaseProps, 'style'> {
  children: React.ReactNode;
  variant: FormGroupCaptionVariant;
  id?: string;
  style?: StyleProp<ViewStyle>;
}

export const FormGroupCaption: React.FC<FormGroupCaptionProps> = ({
  children,
  id: idProp,
  variant,
  dataTestId,
  style,
}) => {
  const context = useFormGroupContext();
  const resolvedId = idProp ?? context?.captionId;

  const styles = useNativeStyles((theme) => ({
    root: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginTop: theme.spacing8,
      gap: theme.spacing2,
    } satisfies ViewStyle,
    textInfo: { color: theme.colorTextOnLightTertiary } satisfies TextStyle,
    textError: { color: theme.colorTextStateAttentionOnLight } satisfies TextStyle,
    textSuccess: { color: theme.colorTextStateSuccessOnLight } satisfies TextStyle,
  }));

  const textStyle =
    variant === 'info'
      ? styles.textInfo
      : variant === 'error'
        ? styles.textError
        : styles.textSuccess;

  const accessibilityRole = variant === 'error' ? 'alert' : undefined;
  const accessibilityLiveRegion = variant === 'error' ? ('assertive' as const) : undefined;

  return (
    <View
      nativeID={resolvedId}
      style={[styles.root, style]}
      testID={dataTestId}
      accessibilityRole={accessibilityRole}
      accessibilityLiveRegion={accessibilityLiveRegion}
    >
      <UtilityBody size="x-small" weight="regular">
        <Text style={textStyle}>{children}</Text>
      </UtilityBody>
    </View>
  );
};
