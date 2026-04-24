'use client';

import React from 'react';
import { BaseProps } from '@/types/globalTypes';
import { useFormGroupContext } from '../../FormGroupContext';
import styles from '../FormGroup.module.scss';
import classNames from 'classnames';
import { InformationIcon, ErrorIcon, CheckIcon } from '@/icons';

export const FORM_GROUP_CAPTION_VARIANTS = ['info', 'error', 'success'] as const;
export type FormGroupCaptionVariant = (typeof FORM_GROUP_CAPTION_VARIANTS)[number];

export interface FormGroupCaptionProps
  extends BaseProps,
    Omit<React.ComponentPropsWithoutRef<'div'>, 'children' | 'className' | 'style'> {
  children: React.ReactNode;
  variant: FormGroupCaptionVariant;
}

export const FormGroupCaption: React.FC<FormGroupCaptionProps> = ({
  children,
  id: idProp,
  variant,
  dataTestId,
  className,
  style,
  role: roleProp,
  ...rest
}) => {
  const context = useFormGroupContext();
  const id = idProp ?? context?.captionId;
  // Accessibility: Error captions should be announced immediately to screen readers
  // role="alert" creates a live region that announces errors when they appear dynamically
  // Caller may override `role` (e.g. keep role="alert" while toggling visibility for layout).
  const defaultRole = variant === 'error' ? 'alert' : undefined;
  const role = roleProp ?? defaultRole;

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
      {...rest}
      id={id}
      role={role}
      className={classNames(
        'typography-utility-text-regular-x-small',
        styles.caption,
        styles[`caption-${variant}`],
        className
      )}
      style={style}
      data-testid={dataTestId}
    >
      <span className={styles.icon}>{icon}</span>
      <span>{children}</span>
    </div>
  );
};
