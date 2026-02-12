import React from 'react';
import classNames from 'classnames';
import { BaseProps } from '../../types/globalTypes';
import { useFormGroupContext } from './FormGroupContext';

export interface FormGroupCaptionProps extends BaseProps {
  variant: 'info' | 'error' | 'success';
  children: React.ReactNode;
  id?: string; // Can be overridden, otherwise uses context
}

export const FormGroupCaption: React.FC<FormGroupCaptionProps> = ({
  variant,
  children,
  id: idProp,
  className,
  dataTestId,
}) => {
  const context = useFormGroupContext();
  // Use provided id or get caption id from context (only one caption per FormGroup)
  const id = idProp ?? context?.captionId;

  return (
    <div
      id={id}
      className={classNames('caption', `caption-${variant}`, className)}
      data-variant={variant}
      data-testid={dataTestId}
    >
      {children}
    </div>
  );
};
