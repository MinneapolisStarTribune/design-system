import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Icon } from '@/components/Icon/Icon';
import { IconName } from '@/components/Icon/iconNames';
import { getIconLabel } from '@/utils/accessibilityHelpers';
import { useAnalytics } from '@/hooks/useAnalytics';
import styles from './UtilityButton.module.scss';
import { UtilityLabel } from '@/components/Typography/Utility';
import { BaseProps, Size } from '@/types/globalTypes';
export const BUTTON_COLORS = ['neutral', 'brand', 'brand-accent'] as const;
export type ButtonColor = (typeof BUTTON_COLORS)[number];
export const BUTTON_VARIANTS = ['default'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export const BUTTON_SIZES = ['small', 'large'] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];
export const ICON_ONLY_BUTTON_SIZES = ['small', 'large'] as const;
export type IconOnlyButtonSize = (typeof ICON_ONLY_BUTTON_SIZES)[number];

/** Extra data to merge into the tracking event. Use for per-utility-button context (e.g. cta_type, module_position). */
export type UtilityButtonAnalytics = Record<string, unknown>;

export interface UtilityButtonProps extends BaseProps {
  variant: ButtonVariant;
  color?: ButtonColor;
  capitalize?: boolean;
  size?: Extract<Size, 'small' | 'large'>;
  icon?: IconName;
  children?: React.ReactNode;
  isDisabled?: boolean;
  /** Per-button tracking data merged into the event. Use to distinguish buttons (e.g. cta_type, module_name). */
  analytics?: UtilityButtonAnalytics;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  label: string;
}

/**
 * Build CSS variable name for button tokens
 * Examples:
 * - neutral + default -> 'button-utility-border-default'
 * - brand + toggle -> 'button-utility-border-toggle'
 * - brand-accent + link -> 'button-utility-link'
 */
// function getButtonTokenPrefix(color: ButtonColor, variant: ButtonVariant): string {
//   if (color === 'neutral') {
//     return `button-utility-border-${variant}`;
//   } else if (color === 'brand') {
//     return `button-utility-brand-${variant}`;
//   } else {
//     return `button-utility-brand-accent-${variant}`;
//   }
// }

// component-button-utility-border-default

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

//Large button + icon = small icon size (16x16)
//Large button icon only = medium (20x20)
//small button + icon = xsmall (14x14)
//small button icon only = small (16x16)

/**
 * Get icon size for a button based on button size and whether it's icon-only
 */
function getButtonIconSize(
  size: ButtonSize | 'x-small',
  isIconOnly: boolean
): 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | undefined {
  const iconSizeMap: Record<ButtonSize, 'x-small' | 'small' | 'medium'> = {
    small: 'x-small',
    large: 'small',
  };

  const iconOnlySizeMap: Record<IconOnlyButtonSize, 'small' | 'medium' | 'large' | 'x-large'> = {
    small: 'small',
    large: 'medium',
  };

  if (isIconOnly) {
    return iconOnlySizeMap[size as IconOnlyButtonSize];
  }
  return iconSizeMap[size as ButtonSize];
}

/**
 * Get button aria-label, falling back to label text, children, or icon name
 */
function getButtonAriaLabel(
  explicitAriaLabel: string | undefined,
  label: string | undefined,
  children: React.ReactNode,
  icon: IconName | undefined
): string | undefined {
  if (explicitAriaLabel) return explicitAriaLabel;
  if (label) return label;
  if (typeof children === 'string') return children;
  if (icon) return `${getIconLabel(icon)} icon`;
  return undefined;
}

export const UtilityButton: React.FC<UtilityButtonProps> = ({
  color = 'neutral',
  capitalize = false,
  variant = 'default',
  size = 'large',
  icon,
  children,
  className,
  isDisabled,
  onClick,
  analytics: analyticsOverride,
  label,
  ...props
}) => {
  const { track } = useAnalytics();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [hasGradientBorder, setHasGradientBorder] = useState(false);

  // Determine if this is an icon-only button (has icon but no text label or children)
  const isIconOnly = !!icon && !label && !children;

  // Validate that x-small can only be used for icon-only buttons
  // if (size === 'x-small' && !isIconOnly) {
  //   throw new Error(
  //     createDesignSystemError(
  //       'UtilityButton',
  //       'x-small size is only valid for icon-only buttons. Please either remove the text children or use a different size.'
  //     )
  //   );
  // }

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const trackingLabel = label ?? (typeof children === 'string' ? children : undefined);
    track({
      event: 'button_click',
      component: 'UtilityButton',
      label: trackingLabel,
      icon: icon ?? undefined,
      variant,
      color,
      ...analyticsOverride,
    });
    onClick?.(e);
  };

  // Build token prefix for CSS variables
  // const tokenPrefix = getButtonTokenPrefix(color, variant);

  // Check for gradient borders on brand-accent buttons (only for filled and outlined)
  // This checks if the hover-border token contains "gradient" (for Varsity brand)
  useEffect(() => {
    let nextHasGradientBorder = false;

    if (
      color === 'brand-accent' &&
      (variant === 'default') &&
      buttonRef.current
    ) {
      const hoverBorderVar = `--color-button-utility-hover-border`;
      const hoverBorderValue = getCSSVariable(buttonRef.current, hoverBorderVar);
      // Check if the value contains "gradient" (e.g., "linear-gradient(...)")
      nextHasGradientBorder = !!(hoverBorderValue && hoverBorderValue.includes('gradient'));
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasGradientBorder(nextHasGradientBorder);
  }, [color, variant]);

  const effectiveSize: ButtonSize = size;

  // Get icon size and create icon element
  const iconSize = icon ? getButtonIconSize(effectiveSize, isIconOnly) : undefined;
  const iconElement = icon ? (
    <Icon name={icon} size={iconSize} className={styles.icon} aria-hidden />
  ) : null;

  // Get aria-label for accessibility
  const ariaLabel = (props as React.ButtonHTMLAttributes<HTMLButtonElement>)['aria-label'];
  const buttonAriaLabel = getButtonAriaLabel(ariaLabel, label, children, icon);

  // Apply special classes for gradient borders
  const brandAccentFilledClass =
    color === 'brand-accent' && variant === 'default' && hasGradientBorder
      ? styles['brand-accent-filled']
      : undefined;
  const brandAccentOutlinedClass =
    color === 'brand-accent' && variant === 'default' && hasGradientBorder
      ? styles['brand-accent-outlined']
      : undefined;

  // Combine class names - use styles object for CSS modules
  // Use effectiveSize for class name (x-small only works for icon-only, otherwise falls back to small)
  const sizeClass = styles[effectiveSize as ButtonSize];

  const combinedClassNames = classNames(
    'color-button-utility-active-icon-hover',
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
      type="button"
      aria-label={buttonAriaLabel}
      disabled={isDisabled}
      className={combinedClassNames || undefined}
      onClick={handleClick}
      {...props}
    >
      {iconElement}
      {!isIconOnly && (
        <UtilityLabel size={effectiveSize as ButtonSize} weight="semibold" capitalize={capitalize}>
          {label ?? children}
        </UtilityLabel>
      )}
    </button>
  );
};
