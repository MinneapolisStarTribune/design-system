import React from 'react';
import classNames from 'classnames';
import { BaseProps } from '../../types/globalTypes';
import { useFormGroupContext } from './FormGroupContext';

export interface FormGroupLabelProps extends BaseProps {
  children: React.ReactNode;
  id?: string; // Can be overridden, otherwise uses context
  htmlFor?: string; // Optional explicit association
}

export const FormGroupLabel: React.FC<FormGroupLabelProps> = ({
  children,
  id: idProp,
  htmlFor,
  className,
  dataTestId,
}) => {
  const context = useFormGroupContext();
  // Use provided id or fall back to context id
  const id = idProp ?? context?.labelId;

  return (
    <label
      id={id}
      htmlFor={htmlFor}
      className={classNames('label', className)}
      data-testid={dataTestId}
    >
      {children}
    </label>
  );
};
