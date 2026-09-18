'use client';

import React, { ReactNode, useCallback } from 'react';
import classNames from 'classnames';
import { Button } from '@/components/Button/web/Button';
import { ChevronRightIcon } from '@/icons';
import { PopoverDescription } from '../Popover/PopoverDescription';
import { useTooltipCloseContext } from './TooltipContext';
import styles from './TooltipExternalContent.module.scss';

export type TooltipExternalContentProps = {
  icon: ReactNode;
  heading: string;
  description: string;
  dismissText: string;
  /** Called when the dismiss control is activated, before the tooltip is closed. Use for analytics/side-effects — closing itself is handled automatically via `useTooltipCloseContext`. */
  onDismiss?: () => void;
  className?: string;
};

/**
 * Fixed-layout content for a `Tooltip` given via its `content` prop — an icon, a heading, a
 * description, and a dismiss control. Compose it as `<Tooltip.ExternalContent .../>`.
 */
export const TooltipExternalContent: React.FC<TooltipExternalContentProps> = ({
  icon,
  heading,
  description,
  dismissText,
  onDismiss,
  className,
}) => {
  const { close } = useTooltipCloseContext();

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
