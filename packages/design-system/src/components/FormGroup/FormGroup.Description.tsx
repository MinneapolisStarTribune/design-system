import React from 'react';
import { BaseProps } from '@/types/globalTypes';
import { useFormGroupContext } from './FormGroupContext';

export interface FormGroupDescriptionProps extends BaseProps {
  children: React.ReactNode;
  id?: string;
}

export const FormGroupDescription: React.FC<FormGroupDescriptionProps> = ({
  children,
  id: idProp,
  dataTestId,
}) => {
  const context = useFormGroupContext();
  const id = idProp ?? context?.descriptionId;

  return (
    <span
      id={id}
      data-testid={dataTestId}
      className="typography-utility-text-regular-x-small"
      style={{
        display: 'block',
        marginTop: 'var(--space-2, 2px)',
        marginBottom: 'var(--space-8, 8px)',
      }}
    >
      {children}
    </span>
  );
};
