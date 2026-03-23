import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useAnalytics } from '@/hooks/useAnalytics';
import styles from './Button.module.scss';
import { UtilityLabel } from '@/components/Typography/Utility';
import { BaseProps } from '@/types/globalTypes';
import { type IconSize } from '@/components/Icon/Icon.types';
import { createDesignSystemError } from '@/utils/errorPrefix';
import { enhanceButtonIcon, getButtonAriaLabel } from '../Helpers';

export const BUTTON_COLORS = ['neutral', 'brand', 'brand-accent'] as const;
export type ButtonColor = (typeof BUTTON_COLORS)[number];
export const BUTTON_VARIANTS = ['filled', 'outlined', 'ghost'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export const BUTTON_SIZES = ['small', 'medium', 'large'] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];
export const ICON_ONLY_BUTTON_SIZES = ['x-small', 'small', 'medium', 'large'] as const;
export type IconOnlyButtonSize = (typeof ICON_ONLY_BUTTON_SIZES)[number];

/** Extra data to merge into the tracking event. Use for per-button context (e.g. cta_type, module_position). */
export type ButtonAnalytics = Record<string, unknown>;

export interface ButtonProps extends BaseProps {
  type?: 'button' | 'submit' | 'reset';
  color?: ButtonColor;
  capitalize?: boolean;
  variant?: ButtonVariant;
  /**
   * Button size. Note: 'x-small' is only valid for icon-only buttons (buttons with icon but no text children).
   */
  size?: ButtonSize | 'x-small';
  /**
   * Optional icon. For icon-only buttons, pass the icon (e.g. icon={<AvatarIcon />}).
   * For buttons with text, use iconPosition to place it before or after the label.
   */
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  iconPosition?: 'start' | 'end';
  children?: React.ReactNode;
  isDisabled?: boolean;
  /** Per-button tracking data merged into the event. Use to distinguish buttons (e.g. cta_type, module_name). */
  analytics?: ButtonAnalytics;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

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

/**
 * Get icon size token for a button based on button size and whether it's icon-only.
 */
function getButtonIconSize(
  size: ButtonSize | 'x-small',
  isIconOnly: boolean
): IconSize | undefined {
  const iconSizeMap: Record<ButtonSize, 'x-small' | 'small' | 'medium'> = {
    small: 'x-small',
    medium: 'small',
    large: 'medium',
  };

  const iconOnlySizeMap: Record<IconOnlyButtonSize, 'small' | 'medium' | 'large' | 'x-large'> = {
    'x-small': 'small',
    small: 'medium',
    medium: 'large',
    large: 'x-large',
  };

  if (isIconOnly) {
    return iconOnlySizeMap[size as IconOnlyButtonSize];
  }
  return iconSizeMap[size as ButtonSize];
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
    isIconOnly || iconPosition === 'start' ? enhanceButtonIcon(icon, iconSizeName, styles.icon) : null;
  const rightIcon =
    !isIconOnly && iconPosition === 'end' ? enhanceButtonIcon(icon, iconSizeName, styles.icon) : null;

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
