'use client';

import React, { useLayoutEffect } from 'react';
import classNames from 'classnames';
import styles from './Popover.module.scss';
import { usePopoverContext } from './PopoverContext';
import { Button } from '@/components/Button/web/Button';
import { CloseIcon } from '@/icons';
import type { PopoverHeadingProps } from './Popover.types';

/** Title row with an optional eyebrow, value and close button. Names the popover dialog. */
export const PopoverHeading: React.FC<PopoverHeadingProps> = ({
  children,
  eyebrow,
  value,
  showCloseButton = true,
  className,
  dataTestId,
}) => {
  const { close, headingId, setHasHeading } = usePopoverContext();

  useLayoutEffect(() => {
    setHasHeading(true);
    return () => setHasHeading(false);
  }, [setHasHeading]);

  const hasTitle = typeof children === 'string' || typeof children === 'number';
  const hasEyebrow = eyebrow != null;

  return (
    <div
      className={classNames(
        styles.header,
        { [styles.headerWithoutClose]: !showCloseButton },
        'typography-utility-section-h6',
        className
      )}
      data-testid={dataTestId}
    >
      <div className={classNames(styles.headingText, { [styles.title]: hasTitle || hasEyebrow })}>
        {hasEyebrow && (
          <div className={classNames(styles.eyebrow, 'typography-utility-text-regular-xx-small')}>
            {eyebrow}
          </div>
        )}
        <div className={styles.titleRow}>
          <div id={headingId}>{children}</div>
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
          className={styles.closeButton}
          dataTestId={dataTestId && `${dataTestId}-close-button`}
          onClick={close}
        />
      )}
    </div>
  );
};

PopoverHeading.displayName = 'Popover.Heading';
