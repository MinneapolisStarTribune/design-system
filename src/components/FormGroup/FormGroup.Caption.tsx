import React from 'react';
import { BaseProps } from '@/types/globalTypes';
import { useFormGroupContext } from './FormGroupContext';

export interface FormGroupCaptionProps extends BaseProps {
  children: React.ReactNode;
  variant: 'info' | 'error' | 'success';
  id?: string;
}

export const FormGroupCaption: React.FC<FormGroupCaptionProps> = ({
  children,
  id: idProp,
  variant,
  dataTestId,
}) => {
  const context = useFormGroupContext();
  const id = idProp ?? context?.captionId;
  // Accessibility: Error captions should be announced immediately to screen readers
  // role="alert" creates a live region that announces errors when they appear dynamically
  // This ensures users are notified of validation errors without having to navigate to the field
  const role = variant === 'error' ? 'alert' : undefined;

  let color: string;
  let icon: React.ReactNode = null;

  switch (variant) {
    case 'info':
      color = 'var(--color-text-on-light-tertiary)';
      icon = null; // TODO: info.icon
      break;
    case 'error':
      color = 'red';
      icon = null; // TODO: error.icon
      break;
    case 'success':
      color = 'green';
      icon = null; // TODO: success.icon
      break;
  }

  return (
    <div 
        id={id} 
        role={role}
        className={`typography-utility-text-regular-x-small`}
        style={{ color }}
        data-testid={dataTestId}
    >
      {icon}
      {children}
    </div>
  );
};
