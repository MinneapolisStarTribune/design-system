import { twMerge } from 'tailwind-merge';
import React from 'react';
import { Icon } from '../Icon/Icon';
import { IconName } from '../Icon/iconNames';
import { BaseProps, VariantProps, AccessibilityProps, IconColor } from '../../types/globalTypes';

export type ButtonColor = 'black' | 'green';
export type ButtonVariant = 'primary' | 'secondary' | 'text';

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
  variant = 'text',
  color = 'black',
  size = 'medium',
  icon,
  iconColor,
  iconPosition = 'end',
  label,
  disabled,
  isDisabled,
  onClick,
  as: LinkComponent,
  href,
  linkProps,
  dataTestId = 'button',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: ButtonProps) => {
  // Use disabled prop if provided, otherwise fall back to isDisabled from VariantProps
  const isButtonDisabled = disabled ?? isDisabled ?? false;
  const classList = twMerge(
    ['ds:inline-flex', 'ds:items-center', 'ds:gap-1', 'ds:cursor-pointer'],
    (variant === 'primary' || variant === 'secondary') && [
      'ds:rounded-full',
      'ds:px-5',
      'ds:py-2',
      'ds:font-semibold',
      'ds:uppercase',
    ],
    variant === 'primary' && [
      'ds:bg-base-black',
      'ds:hover:bg-gray-700',
      'ds:text-base-white',
      'ds:max-xl:text-xs',
      'ds:max-xl:px-4',
    ],
    variant === 'secondary' && ['ds:border'],
    color === 'green' && [
      'ds:bg-linear-to-r ds:from-[var(--color-brand-03-from)] ds:to-[var(--color-brand-03-to)] ds:text-base-black ds:border-1 ds:border-transparent',
      'ds:hover:bg-none ds:hover:border-1 ds:hover:border-bright-green ds:hover:text-base-white',
    ],
    color === 'black' && ['ds:bg-[var(--color-brand-01)]'],
    size === 'small' && 'ds:text-xs',
    size === 'medium' && ['ds:text-sm', 'ds:px-6', 'ds:py-3'],
    size === 'large' && ['ds:text-base', 'ds:px-6', 'ds:py-4'],
    className
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
      {label}
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
        disabled={isButtonDisabled}
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
