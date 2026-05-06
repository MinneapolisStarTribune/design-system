import { View } from 'react-native';
import { BaseRadioGroupProps } from '../RadioGroup.types';
import { Radio } from '@/components/Radio/native/Radio.native';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
import { useContext } from 'react';
import { createDesignSystemError } from '@/utils/errorPrefix';
import { useNativeStyles } from '@/hooks/useNativeStyles';
import { createStyles } from './RadioGroup.styles';

export interface RadioGroupProps extends BaseRadioGroupProps {
  accessibilityLabel?: string;
  dataTestId?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  options,
  color = 'neutral',
  disabled = false,
  error = false,
  onChange,
  dataTestId = 'radio-group',
  accessibilityLabel,
}) => {
  const context = useContext(DesignSystemContext);

  if (!context) {
    throw new Error(
      createDesignSystemError('RadioGroup', 'must be used within a DesignSystemProvider.')
    );
  }

  const styles = useNativeStyles(createStyles);

  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked && value !== optionValue) {
      onChange(optionValue);
    }
  };

  const accessibilityHint = error ? 'Error: one or more options may require attention' : undefined;

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel ?? name}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled,
      }}
      testID={dataTestId}
      style={styles.root}
    >
      {options.map((option, index) => {
        const isChecked = value === option.value;
        const isLast = index === options.length - 1;

        return (
          <View key={option.value} style={[styles.option, isLast && styles.lastOption]}>
            <Radio
              label={option.title}
              description={option.description}
              checked={isChecked}
              color={color}
              disabled={disabled}
              error={error}
              onChange={(checked) => handleChange(option.value, checked)}
              dataTestId={`${dataTestId}-option-${option.value}`}
            />
          </View>
        );
      })}
    </View>
  );
};

RadioGroup.displayName = 'RadioGroup';
