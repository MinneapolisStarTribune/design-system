import React from 'react';
import classNames from 'classnames';
import { BaseProps } from '@/types/globalTypes';
import { useFormGroupContext } from './FormGroupContext';
// import styles from './FormGroup.module.scss';

export interface FormGroupLabelProps extends BaseProps {
  children: React.ReactNode;
  element?: string;
  size?: string;
  weight?: string;
  id?: string;
  htmlFor?: string;
  required?: boolean;
}

export const FormGroupLabel: React.FC<FormGroupLabelProps> = ({
  children,
  element = 'label',
  size,
  weight,
  id: idProp,
  htmlFor,
  required = false,
  className,
  dataTestId,
}) => {
  const context = useFormGroupContext();
  const id = idProp ?? context?.labelId;
  const htmlForValue = htmlFor ?? context?.inputId;
  //example: "typography-utility-text-regular-xx-small"
  const typographyClassName = `typography-utility-text-${weight}-${size}`;
  const combinedClassNames = classNames(typographyClassName, className);
  const Component = element as React.ElementType;

  return (
    <Component
      id={id}
      htmlFor={htmlForValue}
      className={combinedClassNames}
      data-testid={dataTestId}
    >
      {children}
      {required && ' (Optional)'}
    </Component>
  );
};
