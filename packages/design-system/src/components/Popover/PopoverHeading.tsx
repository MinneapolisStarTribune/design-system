import React from 'react';
import classNames from 'classnames';
import styles from './Popover.module.scss';
import { usePopoverContext } from './PopoverContext';
import { Button } from '@/components/Button/web/Button';
import { CloseIcon } from '@/icons';

export const PopoverHeading: React.FC<{
  children: React.ReactNode;
  /**
   * Heading container classes.
   * Kept as headerClassName for backwards compatibility.
   */
  headerClassName?: string;
  titleClassName?: string;
  closeButtonClassName?: string;
}> = ({ children, headerClassName, titleClassName, closeButtonClassName }) => {
  const { close } = usePopoverContext();
  const isDarkTheme =
    typeof document !== 'undefined' &&
    (document.documentElement.getAttribute('data-theme') === 'dark' ||
      document.body.classList.contains('sb-dark'));
  const typographyClassName = isDarkTheme
    ? 'typography-utility-section-h6 text-on-dark-primary'
    : 'typography-utility-section-h6 text-on-light-primary';
  const hasTitle = typeof children === 'string' || typeof children === 'number';

  return (
    <div className={classNames(styles.header, typographyClassName, headerClassName)}>
      <div className={classNames({ [styles.title]: hasTitle }, titleClassName)}>{children}</div>

      <Button
        variant="ghost"
        size="small"
        icon={<CloseIcon />}
        surface={isDarkTheme ? 'dark' : 'light'}
        aria-label="Close popover"
        className={classNames(styles.closeButton, closeButtonClassName)}
        onClick={close}
      />
    </div>
  );
};
