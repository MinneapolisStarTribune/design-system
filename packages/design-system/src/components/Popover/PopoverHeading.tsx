import React from 'react';
import classNames from 'classnames';
import styles from './Popover.module.scss';
import { usePopoverContext } from './PopoverContext';
import { Button } from '@/components/Button/web/Button';
import { CloseIcon } from '@/icons';

export const PopoverHeading: React.FC<{
  children: React.ReactNode;
  headerClassName?: string;
  titleClassName?: string;
  closeButtonClassName?: string;
}> = ({ children, headerClassName, titleClassName, closeButtonClassName }) => {
  const { close } = usePopoverContext();
  const typographyClassName = 'typography-utility-section-h6 text-on-light-primary';
  const hasTitle = typeof children === 'string' || typeof children === 'number';

  return (
    <div className={classNames(styles.header, typographyClassName, headerClassName)}>
      <div className={classNames({ [styles.title]: hasTitle }, titleClassName)}>{children}</div>

      <Button
        variant="ghost"
        size="small"
        icon={<CloseIcon />}
        aria-label="Close popover"
        className={classNames(styles.closeButton, closeButtonClassName)}
        onClick={close}
      />
    </div>
  );
};
