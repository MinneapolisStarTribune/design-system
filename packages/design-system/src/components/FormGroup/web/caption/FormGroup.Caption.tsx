import React from 'react';
import { BaseProps } from '@/types/globalTypes';
import { useFormGroupContext } from '../../FormGroupContext';
import styles from '../FormGroup.module.scss';
import classNames from 'classnames';
import { InformationIcon, ErrorIcon, CheckIcon } from '@/icons';

export const FORM_GROUP_CAPTION_VARIANTS = ['info', 'error', 'success'] as const;
export type FormGroupCaptionVariant = (typeof FORM_GROUP_CAPTION_VARIANTS)[number];

export interface FormGroupCaptionProps extends BaseProps {
  children: React.ReactNode;
  variant: FormGroupCaptionVariant;
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
      icon = <InformationIcon size="small" aria-hidden />;
      break;
    case 'error':
      color = 'var(--color-text-state-attention-on-light)';
      icon = <ErrorIcon size="small" aria-hidden />;
      break;
    case 'success':
      color = 'var(--color-text-state-success-on-light)';
      icon = <CheckIcon size="small" aria-hidden />;
      break;
  }

  return (
    <div
      id={id}
      role={role}
      className={classNames('typography-utility-text-regular-x-small', styles.caption)}
      style={{ color }}
      data-testid={dataTestId}
    >
      <span className={styles.icon}>{icon}</span>
      <span>{children}</span>
    </div>
  );
};
