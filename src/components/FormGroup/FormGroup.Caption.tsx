import React from 'react';
import { BaseProps } from '@/types/globalTypes';
import { useFormGroupContext } from './FormGroupContext';
import { Icon } from '@/components/Icon/Icon';

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
      icon = <Icon name="information" size="small" aria-hidden />;
      break;
    case 'error':
      color = 'var(--color-text-state-attention-on-light)';
      icon = <Icon name="error" size="small" aria-hidden />;
      break;
    case 'success':
      color = 'var(--color-text-state-success-on-light, #00854B)';
      icon = <Icon name="check" size="small" aria-hidden />;
      break;
  }

  return (
    <div
      id={id}
      role={role}
      className="typography-utility-text-regular-x-small"
      style={{
        color,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
        marginTop: 'var(--spacing-8)',
      }}
      data-testid={dataTestId}
    >
      <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
};
