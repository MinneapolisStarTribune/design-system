import React from 'react';
import classNames from 'classnames';
import { BaseProps } from '@/types/globalTypes';
import { FormButton } from './Form.Button';
import styles from './Form.module.scss';

export const FORM_ORIENTATIONS = ['vertical', 'horizontal'] as const;
export type FormOrientation = (typeof FORM_ORIENTATIONS)[number];

export interface FormProps extends BaseProps {
  children: React.ReactNode;
  /**
   * Layout direction: vertical (stacked with 16px gap, button bottom-right) or
   * horizontal (FormGroup + button on one row).
   * @default 'vertical'
   */
  orientation?: FormOrientation;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}

/**
 * Optional form wrapper that provides layout and a semantic <form> element.
 * - Vertical: FormGroups stacked with 16px gap; submit button bottom-right.
 * - Horizontal: FormGroup (label + control) and submit button on one row.
 */
export const Form: React.FC<FormProps> & {
  Button: typeof FormButton;
} = ({ children, className, dataTestId, orientation = 'vertical', onSubmit }) => (
  <form
    className={classNames(
      styles.form,
      orientation === 'vertical' ? styles.formVertical : styles.formHorizontal,
      className
    )}
    data-testid={dataTestId}
    onSubmit={onSubmit}
  >
    {children}
  </form>
);

Form.Button = FormButton;
