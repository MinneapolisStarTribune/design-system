import React from 'react';
import {
  Button as MantineButton,
  ButtonProps as MantineButtonProps,
  useMantineTheme,
} from '@mantine/core';
import classNames from 'classnames';
import { Icon } from '../Icon/Icon';
import { IconName } from '../Icon/iconNames';
import { IconColor } from '../../types/globalTypes';
import { getIconLabel } from '../../utils/accessibilityHelpers';
import styles from './Button.module.scss';

export const BUTTON_COLORS = ['neutral', 'brand', 'brand-accent'] as const;
export type ButtonColor = (typeof BUTTON_COLORS)[number];
export const BUTTON_VARIANTS = ['filled', 'outlined', 'ghost'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export const BUTTON_SIZES = ['small', 'medium', 'large'] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];

export interface ButtonProps
  extends Omit<MantineButtonProps, 'color' | 'variant' | 'size' | 'leftSection' | 'rightSection'> {
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
  children: _children,
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
  // Map button color/variant combinations to appropriate icon color tokens
  const getIconColor = (): IconColor | undefined => {
    // Brand colors map directly to icon colors
    if (color === 'brand') return 'brand-button-icon';
    if (color === 'brand-accent') return 'brand-accent-button-icon';

    // Neutral color uses variant-specific icon colors
    if (color === 'neutral') {
      const variantIconMap: Record<ButtonVariant, IconColor> = {
        filled: 'neutral-filled-button-icon',
        outlined: 'neutral-outlined-button-icon',
        ghost: 'neutral-ghost-button-icon',
      };
      return variantIconMap[variant];
    }

    return undefined;
  };

  const iconColorValue = getIconColor();

  const iconElement = icon ? (
    <Icon name={icon} color={iconColorValue} size={size} aria-hidden={true} />
  ) : null;

  // Extract aria-label from props if provided (using type assertion for HTML attributes)
  const ariaLabel = (props as React.ButtonHTMLAttributes<HTMLButtonElement>)['aria-label'];

  // Generate aria-label: use explicit aria-label, fallback to label, or generate from icon name for icon-only buttons
  const buttonAriaLabel = ariaLabel || label || (icon ? `${getIconLabel(icon)} icon` : undefined);

  // Use Mantine's leftSection/rightSection for icon positioning
  const leftSection = icon && iconPosition === 'start' ? iconElement : undefined;
  const rightSection = icon && iconPosition === 'end' ? iconElement : undefined;

  // Check if brand-accent filled button should have gradient border
  // Check the theme colors directly to see if the hover-border token is a gradient
  const theme = useMantineTheme();
  const isBrandAccentFilled = color === 'brand-accent' && variant === 'filled';
  const brandAccentHoverBorder = theme.colors['control-brand-accent-hover-border']?.[0];
  const hasGradientBorder = isBrandAccentFilled && brandAccentHoverBorder?.includes('gradient');

  // Apply special hover styles for brand-accent filled button with gradient border
  const brandAccentFilledClass =
    isBrandAccentFilled && hasGradientBorder ? styles.brandAccentFilled : undefined;

  // Combine class names using classnames utility
  const combinedClassNames = classNames(className, brandAccentFilledClass);

  return (
    <MantineButton
      variant={mantineVariant}
      color={color}
      size={size}
      leftSection={leftSection}
      rightSection={rightSection}
      aria-label={buttonAriaLabel}
      disabled={isDisabled}
      className={combinedClassNames || undefined}
      {...props}
    >
      {label}
    </MantineButton>
  );
};
