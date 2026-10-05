'use client';

import React, { useLayoutEffect } from 'react';
import classNames from 'classnames';
import styles from './Popover.module.scss';
import { usePopoverContext } from './PopoverContext';
import { Button } from '@/components/Button/web/Button';
import { CloseIcon } from '@/icons';

export const PopoverHeading: React.FC<{
  children: React.ReactNode;
  /** Small label above the title, such as a date. It is not part of the popover's accessible name. */
  eyebrow?: React.ReactNode;
  /** Content at the end of the title row, such as a total. It is not part of the accessible name. */
  value?: React.ReactNode;
  /**
   * Shows the close button.
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Heading container classes.
   * Kept as headerClassName for backwards compatibility.
   */
  headerClassName?: string;
  titleClassName?: string;
  closeButtonClassName?: string;
}> = ({
  children,
  eyebrow,
  value,
  showCloseButton = true,
  headerClassName,
  titleClassName,
  closeButtonClassName,
}) => {
  const { close, headingId, setHasHeading } = usePopoverContext();

  useLayoutEffect(() => {
    setHasHeading(true);
    return () => setHasHeading(false);
  }, [setHasHeading]);

  const typographyClassName = 'typography-utility-section-h6';
  const hasTitle = typeof children === 'string' || typeof children === 'number';

  return (
    <div
      className={classNames(
        styles.header,
        { [styles.headerWithoutClose]: !showCloseButton },
        typographyClassName,
        headerClassName
      )}
    >
      <div className={classNames(styles.headingText, { [styles.title]: hasTitle || eyebrow })}>
        {eyebrow && (
          <div className={classNames(styles.eyebrow, 'typography-utility-text-regular-xx-small')}>
            {eyebrow}
          </div>
        )}
        <div className={styles.titleRow}>
          <div id={headingId} className={titleClassName}>
            {children}
          </div>
          {value != null && <div className={styles.value}>{value}</div>}
        </div>
      </div>

      {showCloseButton && (
        <Button
          variant="ghost"
          size="small"
          icon={<CloseIcon />}
          surface="light"
          aria-label="Close popover"
          className={classNames(styles.closeButton, closeButtonClassName)}
          onClick={close}
        />
      )}
    </div>
  );
};
