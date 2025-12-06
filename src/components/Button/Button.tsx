import { twMerge } from 'tailwind-merge';
import React from 'react';
import { Icon } from '../Icon/Icon';
import { IconName } from '../Icon/iconNames';
import { BaseProps, VariantProps, AccessibilityProps } from '../../types/globalTypes';
import { getIconLabel } from '../../utils/accessibilityHelpers';

export const BUTTON_COLORS = ['neutral', 'green'] as const;
export type ButtonColor = (typeof BUTTON_COLORS)[number];
export const BUTTON_VARIANTS = ['filled', 'outlined', 'ghost'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export type ButtonProps = BaseProps &
  VariantProps<ButtonColor, ButtonVariant> &
  AccessibilityProps & {
    icon?: IconName;
    iconPosition?: 'start' | 'end';
    label?: string;
    isDisabled?: boolean;
  } & {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };

export const Button = ({
  className = '',
  variant = 'filled',
  color = 'neutral',
  size = 'medium',
  icon,
  iconPosition = 'end',
  label,
  isDisabled,
  onClick,
  dataTestId = 'button',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: ButtonProps) => {
  const classList = twMerge(
    [
      'ds:flex',
      'ds:items-center',
      'ds:justify-center',
      icon && label && 'ds:gap-4',
      'ds:cursor-pointer',
      'ds:font-[var(--font-family-graphik)]',
      'ds:rounded-full',
      'ds:font-semibold',
      !icon || label ? 'ds:py-8' : '',
      !icon || label ? 'ds:px-16' : '',
      'ds:focus:outline-none',
      'ds:focus:shadow-[0_0_0_2px_var(--color-background-light-default),0_0_0_4px_var(--color-border-state-focus)]',
    ],
    size === 'small' && ['ds:text-[12px]', 'ds:h-button-sm', icon && !label && 'ds:w-button-sm'],
    size === 'medium' && ['ds:text-[14px]', 'ds:h-button-md', icon && !label && 'ds:w-button-md'],
    size === 'large' && ['ds:text-[16px]', 'ds:h-button-lg', icon && !label && 'ds:w-button-lg'],
    color === 'neutral' &&
      variant === 'filled' && [
        'ds:bg-[var(--color-button-filled-background)]',
        'ds:text-[var(--color-button-filled-text)]',
        'ds:hover:bg-[var(--color-button-filled-hover-background)]',
        'ds:hover:text-[var(--color-button-filled-hover-text)]',
      ],
    color === 'neutral' &&
      variant === 'outlined' && [
        'ds:border-1',
        'ds:border-[var(--color-button-outlined-border)]',
        'ds:text-[var(--color-button-outlined-text)]',
        'ds:hover:bg-[var(--color-button-outlined-hover-background)]',
      ],
    color === 'neutral' &&
      variant === 'ghost' && [
        'ds:bg-[var(--color-button-ghost-background)]',
        'ds:text-[var(--color-button-ghost-text)]',
        'ds:hover:bg-[var(--color-button-ghost-hover-background)]',
        'ds:hover:text-[var(--color-button-ghost-hover-text)]',
      ],
    className
  );

  // Text styles for the label - line-height: 120% based on font size
  const labelClassName = twMerge(
    size === 'small' && 'ds:leading-[120%]', // 12px * 1.2 = 14.4px
    size === 'medium' && 'ds:leading-[120%]', // 14px * 1.2 = 16.8px
    size === 'large' && 'ds:leading-[120%]' // 16px * 1.2 = 19.2px
  );

  // Icon color: use iconColor prop if provided, otherwise default to 'on-light-primary' for neutral buttons
  const iconColorValue = color === 'neutral' ? 'on-light-primary' : undefined;

  // Icon is always decorative (aria-hidden) when using the simple icon prop
  const iconElement = icon ? (
    <Icon
      name={icon}
      color={iconColorValue}
      size={size}
      aria-hidden={true}
      className={iconPosition === 'start' ? 'ds:order-first' : undefined}
    />
  ) : null;

  // Generate aria-label: use explicit aria-label, fallback to label, or generate from icon name for icon-only buttons
  const buttonAriaLabel = ariaLabel || label || (icon ? `${getIconLabel(icon)} icon` : undefined);

  return (
    <button
      className={classList}
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      data-testid={dataTestId}
      aria-label={buttonAriaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {iconPosition === 'start' && iconElement}
      {label && <span className={labelClassName}>{label}</span>}
      {iconPosition === 'end' && iconElement}
    </button>
  );
};
