import { twMerge } from 'tailwind-merge';
import React from 'react';
import { Icon } from '../Icon/Icon';
import { IconName } from '../Icon/iconNames';
import { BaseProps, VariantProps, AccessibilityProps, IconColor } from '../../types/globalTypes';

export type ButtonColor = 'neutral' | 'green';
export type ButtonVariant = 'filled' | 'secondary' | 'text';

export type ButtonProps = BaseProps &
  VariantProps<ButtonColor, ButtonVariant> &
  AccessibilityProps & {
    icon?: IconName;
    iconColor?: IconColor;
    iconPosition?: 'start' | 'end';
    label: string;
    disabled?: boolean; // Using disabled instead of isDisabled for HTML standard
    linkProps?: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
  } & (
    | {
        // External link — consumer must pass an element
        as: React.ElementType;
        href: string;
        onClick?: never;
        linkProps?: never;
      }
    | {
        // Regular button
        as?: never;
        href?: never;
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
        linkProps?: never;
      }
    | {
        // Link using linkProps
        as?: never;
        href?: never;
        onClick?: never;
        linkProps: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
      }
  );

export const Button = ({
  className = '',
  variant = 'filled',
  color = 'neutral',
  size = 'medium',
  icon,
  iconColor,
  iconPosition = 'end',
  label,
  isDisabled,
  onClick,
  as: LinkComponent,
  href,
  linkProps,
  dataTestId = 'button',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: ButtonProps) => {
  const classList = twMerge(
    [
      'ds:flex',
      'ds:items-center',
      'ds:justify-center',
      'ds:gap-4',
      'ds:cursor-pointer',
      'ds:font-[var(--font-family-graphik)]',
      'ds:rounded-full',
      'ds:font-semibold',
      'ds:py-8',
      'ds:px-16',
    ],
    size === 'small' && ['ds:text-[12px]', 'ds:h-button-sm'],
    size === 'medium' && ['ds:text-[14px]', 'ds:h-button-md'],
    size === 'large' && ['ds:text-[16px]', 'ds:h-button-lg'],
    color === 'neutral' &&
      variant === 'filled' && [
        'ds:bg-[var(--color-button-filled-background)]',
        'ds:text-[var(--color-button-filled-text)]',
        'ds:hover:bg-[var(--color-button-filled-hover-background)]',
        'ds:hover:text-[var(--color-button-filled-hover-text)]',
      ],
    className
  );

  // Text styles for the label - line-height: 120% based on font size
  const labelClassName = twMerge(
    size === 'small' && 'ds:leading-[120%]', // 12px * 1.2 = 14.4px
    size === 'medium' && 'ds:leading-[120%]', // 14px * 1.2 = 16.8px
    size === 'large' && 'ds:leading-[120%]' // 16px * 1.2 = 19.2px
  );

  // Icon is always decorative (aria-hidden) when using the simple icon prop
  const iconElement = icon ? (
    <Icon
      name={icon}
      color={iconColor}
      size={size}
      aria-hidden={true}
      className={iconPosition === 'start' ? 'ds:order-first' : undefined}
    />
  ) : null;

  const inners = (
    <>
      {iconPosition === 'start' && iconElement}
      <span className={labelClassName}>{label}</span>
      {iconPosition === 'end' && iconElement}
    </>
  );

  if (!label) return null;

  if (onClick) {
    return (
      <button
        className={classList}
        type="button"
        onClick={onClick}
        disabled={isDisabled}
        data-testid={dataTestId}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {inners}
      </button>
    );
  }

  if (LinkComponent && href) {
    return (
      <LinkComponent
        className={classList}
        href={href}
        data-testid={dataTestId}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {inners}
      </LinkComponent>
    );
  }

  if (linkProps) {
    return (
      <a
        className={classList}
        {...linkProps}
        data-testid={dataTestId}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {inners}
      </a>
    );
  }

  return null;
};
