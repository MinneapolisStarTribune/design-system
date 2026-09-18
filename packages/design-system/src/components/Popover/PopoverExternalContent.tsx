'use client';

import React, { ReactNode, useCallback } from 'react';
import classNames from 'classnames';
import { Button } from '@/components/Button/web/Button';
import { ChevronRightIcon } from '@/icons';
import { PopoverDescription } from './PopoverDescription';
import { usePopoverContext } from './PopoverContext';
import styles from './PopoverExternalContent.module.scss';

export type PopoverExternalContentProps = {
  icon: ReactNode;
  heading: string;
  description: string;
  dismissText: string;
  /** Called when the dismiss control is activated, before the popover is closed. Use for analytics/side-effects — closing itself is handled automatically via `usePopoverContext`. */
  onDismiss?: () => void;
  className?: string;
};

/**
 * Fixed-layout content for a `Popover` — an icon, a heading, a description, and a dismiss
 * control. Compose it as `Popover`'s `children` (e.g. conditionally, alongside a controlled
 * `open`/`onOpenChange` pair driven by whatever trigger source you like) when you want this
 * layout instead of writing your own.
 */
export const PopoverExternalContent: React.FC<PopoverExternalContentProps> = ({
  icon,
  heading,
  description,
  dismissText,
  onDismiss,
  className,
}) => {
  const { close } = usePopoverContext();

  const handleDismiss = useCallback(() => {
    onDismiss?.();
    close();
  }, [onDismiss, close]);

  return (
    <div className={classNames(styles.container, className)}>
      <span className={styles.icon} aria-hidden>
        {icon}
      </span>

      <div className={styles.body}>
        <p className={classNames(styles.heading, 'typography-utility-label-semibold-large')}>
          {heading}
        </p>

        <PopoverDescription>{description}</PopoverDescription>

        <Button
          variant="ghost"
          color="brand-accent"
          size="small"
          icon={<ChevronRightIcon />}
          iconPosition="end"
          className={styles.dismissButton}
          onClick={handleDismiss}
        >
          {dismissText}
        </Button>
      </div>
    </div>
  );
};
