import React from 'react';
import classNames from 'classnames';
import styles from './UtilityButton.module.scss';
import { UtilityLabel } from '@/components/Typography/Utility';
import { BaseProps } from '@/types/globalTypes';
import type { Size } from '@/types/globalTypes';
import { type IconSize } from '@/components/Icon/Icon.types';
import {
  enhanceButtonIcon,
  getUtilityButtonAriaLabel,
  resolveUtilityToggleActiveIcon,
} from '../Helpers';

export const UTILITY_BUTTON_VARIANTS = ['default', 'toggle', 'link'] as const;
export type UtilityButtonVariant = (typeof UTILITY_BUTTON_VARIANTS)[number];

export const UTILITY_BUTTON_SIZES = ['small', 'large'] as const;
export type UtilityButtonSize = Extract<Size, 'small' | 'large'>;

/**
 * Utility button icon size mapping.
 * - Large + label: small (16px)
 * - Large + icon-only: medium (20px)
 * - Small + label: x-small (14px)
 * - Small + icon-only: small (16px)
 */
function getUtilityButtonIconSize(size: UtilityButtonSize, isIconOnly: boolean): IconSize {
  if (size === 'large') {
    return isIconOnly ? 'medium' : 'small';
  }

  return isIconOnly ? 'small' : 'x-small';
}

interface UtilityButtonBaseProps extends BaseProps {
  size?: UtilityButtonSize;
  /** Optional icon element (e.g. icon={<Share02Icon />}) */
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  iconPosition?: 'start' | 'end';
  isDisabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Button label. When absent with an icon, renders icon-only. */
  label?: string;
}

type UtilityButtonToggleProps = UtilityButtonBaseProps & {
  variant: 'toggle';
  /** Controls active/inactive visual state for toggle variant. */
  active: boolean;
};

type UtilityButtonNonToggleProps = UtilityButtonBaseProps & {
  variant?: Exclude<UtilityButtonVariant, 'toggle'>;
  active?: never;
};

export type UtilityButtonProps = UtilityButtonToggleProps | UtilityButtonNonToggleProps;

export const UtilityButton: React.FC<UtilityButtonProps> = ({
  variant = 'default',
  size = 'large',
  active,
  icon,
  iconPosition = 'start',
  isDisabled,
  onClick,
  label,
  className,
  ...props
}) => {
  const hasIcon = !!icon;
  const isIconOnly = hasIcon && !label;

  const displayIcon = resolveUtilityToggleActiveIcon(icon, variant, active) ?? icon;
  const iconSize = hasIcon ? getUtilityButtonIconSize(size, isIconOnly) : undefined;
  const leftIcon =
    hasIcon && (isIconOnly || iconPosition === 'start')
      ? enhanceButtonIcon(displayIcon, iconSize, styles.icon)
      : null;
  const rightIcon =
    hasIcon && !isIconOnly && iconPosition === 'end'
      ? enhanceButtonIcon(displayIcon, iconSize, styles.icon)
      : null;

  const ariaLabel = (props as React.ButtonHTMLAttributes<HTMLButtonElement>)['aria-label'];
  const buttonAriaLabel = getUtilityButtonAriaLabel(ariaLabel, label);
  const ariaPressed = variant === 'toggle' ? active : undefined;
  const toggleStateClass =
    variant === 'toggle' ? (active ? styles.toggleActive : styles.toggleInactive) : undefined;

  const combinedClassNames = classNames(
    styles.utilityButton,
    styles[variant],
    toggleStateClass,
    styles[size],
    isIconOnly && styles['icon-only'],
    isDisabled && styles.disabled,
    className
  );

  // Map UtilityButton size to UtilityLabel size (large button uses medium label typography per spec)
  const labelSize = size === 'small' ? 'small' : 'medium';

  return (
    <button
      type="button"
      aria-label={buttonAriaLabel}
      aria-pressed={ariaPressed}
      disabled={isDisabled}
      className={combinedClassNames || undefined}
      onClick={onClick}
      {...props}
    >
      {leftIcon}
      {!isIconOnly && label && (
        <UtilityLabel size={labelSize} weight="semibold">
          {label}
        </UtilityLabel>
      )}
      {rightIcon}
    </button>
  );
};
