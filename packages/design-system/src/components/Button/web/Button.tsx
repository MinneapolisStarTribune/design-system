'use client';

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useAnalytics } from '@/hooks/useAnalytics';
import styles from './Button.module.scss';
import { UtilityLabel } from '@/components/Typography/Utility';
import { createDesignSystemError } from '@/utils/errorPrefix';
import { enhanceButtonIcon, getButtonAriaLabel, getButtonIconSize } from '../Helpers';
import type { ButtonProps } from '../Button.types';
import {
  type ButtonColor,
  type ButtonSize,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  ICON_ONLY_BUTTON_SIZES,
  type ButtonVariant,
  BUTTON_COLORS,
} from '../Button.types';

export type {
  ButtonProps,
  ButtonColor,
  ButtonVariant,
  ButtonSize,
  IconOnlyButtonSize,
  ButtonAnalytics,
} from '../Button.types';
export { BUTTON_COLORS, BUTTON_VARIANTS, BUTTON_SIZES, ICON_ONLY_BUTTON_SIZES };

/**
 * Build CSS variable name for button tokens
 * Examples:
 * - neutral + filled -> 'button-filled'
 * - brand + outlined -> 'button-brand-outlined'
 * - brand-accent + ghost -> 'button-brand-accent-ghost'
 */
function getButtonTokenPrefix(color: ButtonColor, variant: ButtonVariant): string {
  if (color === 'neutral') {
    return `button-${variant}`;
  } else if (color === 'brand') {
    return `button-brand-${variant}`;
  } else {
    return `button-brand-accent-${variant}`;
  }
}

/**
 * Get CSS variable value from computed styles
 */
function getCSSVariable(element: HTMLElement | null, variableName: string): string | null {
  if (!element || typeof window === 'undefined') {
    return null;
  }
  const computed = window.getComputedStyle(element);
  return computed.getPropertyValue(variableName).trim() || null;
}

export const Button: React.FC<ButtonProps> = ({
  type = 'button',
  color = 'neutral',
  capitalize = false,
  variant = 'filled',
  size = 'medium',
  icon,
  iconPosition = 'end',
  children,
  className,
  isDisabled,
  onClick,
  analytics: analyticsOverride,
  ...props
}) => {
  const { track } = useAnalytics();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [hasGradientBorder, setHasGradientBorder] = useState(false);

  // Determine if this is an icon-only button (has icon but no text children)
  const hasAnyIcon = !!icon;
  const isIconOnly = hasAnyIcon && !children;

  // Validate that x-small can only be used for icon-only buttons
  if (size === 'x-small' && !isIconOnly) {
    throw new Error(
      createDesignSystemError(
        'Button',
        'x-small size is only valid for icon-only buttons. Please either remove the text children or use a different size.'
      )
    );
  }

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const label = typeof children === 'string' ? children : undefined;

    track({
      event: 'button_click',
      component: 'Button',
      label,
      icon: icon ?? undefined,
      variant,
      color,
      ...analyticsOverride,
    });
    onClick?.(e);
  };

  // Build token prefix for CSS variables
  const tokenPrefix = getButtonTokenPrefix(color, variant);

  // Check for gradient borders on brand-accent buttons (only for filled and outlined)
  // This checks if the hover-border token contains "gradient" (for Varsity brand)
  useEffect(() => {
    let nextHasGradientBorder = false;

    if (
      color === 'brand-accent' &&
      (variant === 'filled' || variant === 'outlined') &&
      buttonRef.current
    ) {
      const hoverBorderVar = `--color-${tokenPrefix}-hover-border`;
      const hoverBorderValue = getCSSVariable(buttonRef.current, hoverBorderVar);
      // Check if the value contains "gradient" (e.g., "linear-gradient(...)")
      nextHasGradientBorder = !!(hoverBorderValue && hoverBorderValue.includes('gradient'));
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasGradientBorder(nextHasGradientBorder);
  }, [color, variant, tokenPrefix]);

  const iconSizeName = hasAnyIcon ? getButtonIconSize(size, isIconOnly) : undefined;

  const leftIcon =
    isIconOnly || iconPosition === 'start'
      ? enhanceButtonIcon(icon, iconSizeName, styles.icon)
      : null;
  const rightIcon =
    !isIconOnly && iconPosition === 'end'
      ? enhanceButtonIcon(icon, iconSizeName, styles.icon)
      : null;

  // Get aria-label for accessibility
  const ariaLabel = (props as React.ButtonHTMLAttributes<HTMLButtonElement>)['aria-label'];
  const buttonAriaLabel = getButtonAriaLabel(ariaLabel, children);

  // Apply special classes for gradient borders
  const brandAccentFilledClass =
    color === 'brand-accent' && variant === 'filled' && hasGradientBorder
      ? styles['brand-accent-filled']
      : undefined;
  const brandAccentOutlinedClass =
    color === 'brand-accent' && variant === 'outlined' && hasGradientBorder
      ? styles['brand-accent-outlined']
      : undefined;

  // Combine class names - use styles object for CSS modules
  const sizeClass =
    size === 'x-small' && isIconOnly ? styles['x-small'] : styles[size as ButtonSize];

  const combinedClassNames = classNames(
    styles.button,
    styles[color],
    sizeClass,
    styles[variant],
    brandAccentFilledClass,
    brandAccentOutlinedClass,
    isIconOnly && styles['icon-only'],
    icon && !isIconOnly && styles.hasIcon, // Add class when button has icon + text
    isDisabled && styles.disabled,
    className
  );

  return (
    <button
      ref={buttonRef}
      type={type}
      aria-label={buttonAriaLabel}
      disabled={isDisabled}
      className={combinedClassNames || undefined}
      onClick={handleClick}
      {...props}
    >
      {leftIcon}
      {!isIconOnly && (
        <UtilityLabel size={size as ButtonSize} weight="semibold" capitalize={capitalize}>
          {children}
        </UtilityLabel>
      )}
      {rightIcon}
    </button>
  );
};
