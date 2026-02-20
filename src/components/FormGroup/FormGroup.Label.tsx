import React from 'react';
import { BaseProps } from '@/types/globalTypes';
import { useFormGroupContext } from './FormGroupContext';
import { UtilityBody } from '../Typography/Utility/UtilityBody/UtilityBody';
import { UtilityLabel } from '../Typography/Utility/UtilityLabel/UtilityLabel'

export interface FormGroupLabelProps extends BaseProps {
  children: React.ReactNode;
  element?: string;
  id?: string;
  htmlFor?: string;
  required?: boolean;
}

export const FormGroupLabel: React.FC<FormGroupLabelProps> = ({
  children,
  id: idProp,
  htmlFor,
  required = false,
  dataTestId,
}) => {
  const context = useFormGroupContext();
  const id = idProp ?? context?.labelId;
  const htmlForValue = htmlFor ?? context?.inputId;

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
      <UtilityLabel
        id={id}
        htmlFor={htmlForValue}
        size = 'medium'
        weight = 'bold'
        data-testid={dataTestId}
      >
        {children}
      </UtilityLabel>
      {required && (
        <UtilityBody
          size="xx-small"
          weight="regular"
          style={{ margin: 0 }}
        >
          (Optional)
        </UtilityBody>
      )}
    </div>
  );
};
