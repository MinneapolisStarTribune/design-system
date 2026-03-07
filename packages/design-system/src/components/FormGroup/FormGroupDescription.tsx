// NOTE - THIS IS A STUBBED OUT COMPONENT ONLY.
// PLEASE SEE https://minneapolisstartribune.atlassian.net/browse/SUS-142 FOR MORE INFORMATION.
import React from 'react';
import classNames from 'classnames';
import { BaseProps } from '@/types/globalTypes';
import { useFormGroupContext } from './FormGroupContext';

export interface FormGroupDescriptionProps extends BaseProps {
  children: React.ReactNode;
  id?: string; // Can be overridden, otherwise uses context
}

export const FormGroupDescription: React.FC<FormGroupDescriptionProps> = ({
  children,
  id: idProp,
  className,
  dataTestId,
}) => {
  const context = useFormGroupContext();
  // Use provided id or fall back to context id
  const id = idProp ?? context?.descriptionId;

  return (
    <div id={id} className={classNames('description', className)} data-testid={dataTestId}>
      {children}
    </div>
  );
};
