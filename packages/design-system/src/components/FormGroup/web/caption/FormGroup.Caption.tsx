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

  let icon: React.ReactNode = null;

  switch (variant) {
    case 'info':
      icon = <InformationIcon size="small" color="on-light-tertiary" aria-hidden />;
      break;
    case 'error':
      icon = <ErrorIcon size="small" color="state-attention-on-light" aria-hidden />;
      break;
    case 'success':
      icon = <CheckIcon size="small" color="state-success-on-light" aria-hidden />;
      break;
  }

  return (
    <div
      id={id}
      role={role}
      className={classNames(
        'typography-utility-text-regular-x-small',
        styles.caption,
        styles[`caption-${variant}`]
      )}
      data-testid={dataTestId}
    >
      <span className={styles.icon}>{icon}</span>
      <span>{children}</span>
    </div>
  );
};
