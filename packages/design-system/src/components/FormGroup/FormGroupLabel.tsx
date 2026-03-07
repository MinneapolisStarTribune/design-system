// NOTE - THIS IS A STUBBED OUT COMPONENT ONLY.
// PLEASE SEE https://minneapolisstartribune.atlassian.net/browse/SUS-141 FOR MORE INFORMATION.
import React from 'react';
import classNames from 'classnames';
import { BaseProps } from '@/types/globalTypes';
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
  // The label ID is used by form controls via aria-labelledby for accessibility
  const id = idProp ?? context?.labelId;
  // htmlFor connects the label to the form control for click-to-focus behavior
  // Uses context inputId if not explicitly provided
  const htmlForValue = htmlFor ?? context?.inputId;

  return (
    <label
      id={id}
      htmlFor={htmlForValue}
      className={classNames('label', className)}
      data-testid={dataTestId}
    >
      {children}
    </label>
  );
};
