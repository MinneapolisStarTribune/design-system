import React from 'react';
import classNames from 'classnames';
import { ExpandIcon, type IconColor, type IconSize } from '@/icons';
import styles from './ExpandButton.module.scss';

interface ExpandButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
  color?: IconColor;
  size?: IconSize;
  dataTestId?: string;
  className?: string;
}

export const ExpandButton: React.FC<ExpandButtonProps> = ({
  onClick,
  ariaLabel = 'Expand image',
  color = 'on-dark-primary',
  size = 'large',
  dataTestId = 'expand-button',
  className,
}) => {
  return (
    <button
      type="button"
      className={classNames(styles['expand-button'], className)}
      aria-label={ariaLabel}
      aria-haspopup="dialog"
      onClick={onClick}
      data-testid={dataTestId}
    >
      <span className={styles['expand-icon']} aria-hidden>
        <ExpandIcon size={size} aria-hidden color={color} />
      </span>
    </button>
  );
};
