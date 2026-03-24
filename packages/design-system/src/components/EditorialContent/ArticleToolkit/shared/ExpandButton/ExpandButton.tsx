import React from 'react';
import { ExpandIcon, type IconColor, type IconSize } from '@/icons';
import styles from './ExpandButton.module.scss';

interface ExpandButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
  color?: IconColor;
  size?: IconSize;
}

export const ExpandButton: React.FC<ExpandButtonProps> = ({
  onClick,
  ariaLabel = 'Expand image',
  color = 'on-dark-primary',
  size = 'small',
}) => {
  return (
    <button
      type="button"
      className={styles['expand-button']}
      aria-label={ariaLabel}
      aria-haspopup="dialog"
      onClick={onClick}
    >
      <span className={styles['expand-icon']} aria-hidden>
        <ExpandIcon size={size} aria-hidden color={color} />
      </span>
    </button>
  );
};
