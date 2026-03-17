import React from 'react';
import classNames from 'classnames';
import { Button, type ButtonProps } from '@/components/Button/web/Button';
import styles from './Form.module.scss';

export interface FormButtonProps extends ButtonProps {
  children: React.ReactNode;
}

/**
 * Submit button for use inside Form. Renders a Button with type="submit".
 * Layout (e.g. bottom-right in vertical, inline in horizontal) is controlled by Form.
 */
export const FormButton: React.FC<FormButtonProps> = ({ children, className, ...buttonProps }) => {
  return (
    <div className={styles.formButtonWrap}>
      <Button {...buttonProps} className={classNames(styles.formButton, className)} type="submit">
        {children}
      </Button>
    </div>
  );
};
