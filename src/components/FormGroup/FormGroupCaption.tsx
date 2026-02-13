// NOTE - THIS IS A STUBBED OUT COMPONENT ONLY.
// PLEASE SEE https://minneapolisstartribune.atlassian.net/browse/SUS-143 FOR MORE INFORMATION.
import React from 'react';
import classNames from 'classnames';
import { BaseProps } from '@/types/globalTypes';
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

  // Accessibility: Error captions should be announced immediately to screen readers
  // role="alert" creates a live region that announces errors when they appear dynamically
  // This ensures users are notified of validation errors without having to navigate to the field
  const role = variant === 'error' ? 'alert' : undefined;

  return (
    <div
      id={id}
      role={role}
      className={classNames('caption', `caption-${variant}`, className)}
      data-testid={dataTestId}
    >
      {children}
    </div>
  );
};
