import React from 'react';
import classNames from 'classnames';
import { BaseProps } from '@/types/globalTypes';
import { useFormGroupContext } from './FormGroupContext';
import styles from './FormGroup.module.scss';

export interface FormGroupLabelProps extends BaseProps {
  children: React.ReactNode;
  id?: string;
  htmlFor?: string;
  required?: boolean;
}

export const FormGroupLabel: React.FC<FormGroupLabelProps> = ({
  children,
  id: idProp,
  htmlFor,
  required = false,
  className,
  dataTestId,
}) => {
  const context = useFormGroupContext();
  const id = idProp ?? context?.labelId;
  const htmlForValue = htmlFor ?? context?.inputId;

  return (
    <label
      id={id}
      htmlFor={htmlForValue}
      className={classNames(styles.formGroupLabel, className)}
      data-testid={dataTestId}
    >
      {children}
    </label>
  );
};
