import React from 'react';
import { Button as MantineButton, ButtonProps as MantineButtonProps } from '@mantine/core';
import { Icon } from '../Icon/Icon';
import { IconName } from '../Icon/iconNames';
import { getIconLabel } from '../../utils/accessibilityHelpers';

export const BUTTON_COLORS = ['neutral', 'brand', 'brand-accent'] as const;
export type ButtonColor = (typeof BUTTON_COLORS)[number];
export const BUTTON_VARIANTS = ['filled', 'outlined', 'ghost'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export const BUTTON_SIZES = ['small', 'medium', 'large'] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];

export interface ButtonProps extends Omit<MantineButtonProps, 'color' | 'variant' | 'size' | 'leftSection' | 'rightSection'> {
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: 'start' | 'end';
  label?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isDisabled?: boolean;
}

// Button Styles are defined in the Mantine theme (src/providers/mantine-theme.ts), following their documented best practices.
export const Button: React.FC<ButtonProps> = ({ 
  color = 'neutral', 
  variant = 'filled',
  size = 'medium',
  icon,
  iconPosition = 'end',
  label,
  children,
  className,
  isDisabled,
  ...props 
}) => {
  let mantineVariant;
  if (variant === 'ghost') {
    mantineVariant = 'subtle';
  } else {
    mantineVariant = variant;
  }

  // Determine icon color based on button color and variant
  // Icon is always decorative (aria-hidden) when using the simple icon prop
  const iconColorValue =
    color === 'neutral' && variant === 'filled' ? 'on-dark-primary' : 'on-light-primary';

  const iconElement = icon ? (
    <Icon
      name={icon}
      color={iconColorValue}
      size={size}
      aria-hidden={true}
    />
  ) : null;

  // Extract aria-label from props if provided (using type assertion for HTML attributes)
  const ariaLabel = (props as React.ButtonHTMLAttributes<HTMLButtonElement>)['aria-label'];
  
  // Generate aria-label: use explicit aria-label, fallback to label, or generate from icon name for icon-only buttons
  const buttonAriaLabel = ariaLabel || label || (icon ? `${getIconLabel(icon)} icon` : undefined);

  // Determine content - prefer children over label for flexibility
  const buttonContent = children || label;

  // Use Mantine's leftSection/rightSection for icon positioning
  const leftSection = icon && iconPosition === 'start' ? iconElement : undefined;
  const rightSection = icon && iconPosition === 'end' ? iconElement : undefined;

  return (
    <MantineButton 
      variant={mantineVariant} 
      color={color}
      size={size}
      leftSection={leftSection}
      rightSection={rightSection}
      aria-label={buttonAriaLabel}
      disabled={isDisabled}
      {...props}
    >
      {buttonContent}
    </MantineButton>
  );
};