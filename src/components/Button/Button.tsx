import React from 'react';
import classNames from 'classnames';
import { Icon } from '../Icon/Icon';
import { IconName } from '../Icon/iconNames';
import { getIconLabel } from '../../utils/accessibilityHelpers';
import styles from './Button.module.scss';

export const BUTTON_COLORS = ['neutral', 'brand', 'brand-accent'] as const;
export type ButtonColor = (typeof BUTTON_COLORS)[number];
export const BUTTON_VARIANTS = ['filled', 'outlined', 'ghost'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export const BUTTON_SIZES = ['small', 'medium', 'large'] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: 'start' | 'end';
  label?: string;
  isDisabled?: boolean;
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
  onClick,
  ...props
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [hasGradientBorder, setHasGradientBorder] = React.useState(false);

  // Build token prefix for CSS variables
  const tokenPrefix = getButtonTokenPrefix(color, variant);

  // Check for gradient borders on brand-accent buttons (only for filled and outlined)
  // This checks if the hover-border token contains "gradient" (for Varsity brand)
  React.useEffect(() => {
    if (
      color === 'brand-accent' &&
      (variant === 'filled' || variant === 'outlined') &&
      buttonRef.current
    ) {
      const hoverBorderVar = `--color-${tokenPrefix}-hover-border`;
      const hoverBorderValue = getCSSVariable(buttonRef.current, hoverBorderVar);
      // Check if the value contains "gradient" (e.g., "linear-gradient(...)")
      if (hoverBorderValue && hoverBorderValue.includes('gradient')) {
        setHasGradientBorder(true);
      } else {
        setHasGradientBorder(false);
      }
    } else {
      setHasGradientBorder(false);
    }
  }, [color, variant, tokenPrefix]);

  // Icons use the same color as text (no separate button-icon tokens needed)
  // Icon is always decorative (aria-hidden) when using the simple icon prop
  // By not passing a color prop, Icon component will use 'currentColor' which inherits the button's text color
  const iconElement = icon ? <Icon name={icon} size={size} aria-hidden={true} /> : null;

  // Extract aria-label from props if provided
  const ariaLabel = props['aria-label'];

  // Generate aria-label: use explicit aria-label, fallback to label, or generate from icon name for icon-only buttons
  const buttonAriaLabel = ariaLabel || label || (icon ? `${getIconLabel(icon)} icon` : undefined);

  // Determine icon position
  const leftIcon = icon && iconPosition === 'start' ? iconElement : null;
  const rightIcon = icon && iconPosition === 'end' ? iconElement : null;

  // Apply special classes for gradient borders
  const brandAccentFilledClass =
    color === 'brand-accent' && variant === 'filled' && hasGradientBorder
      ? styles.brandAccentFilled
      : undefined;
  const brandAccentOutlinedClass =
    color === 'brand-accent' && variant === 'outlined' && hasGradientBorder
      ? styles.brandAccentOutlined
      : undefined;

  // Add disabled class for styling
  const disabledClass = isDisabled ? styles.disabled : undefined;

  // Combine class names - use styles object for CSS modules
  const combinedClassNames = classNames(
    styles.button,
    styles[color], // neutral, brand, or brand-accent (CSS modules handles hyphens)
    styles[size], // small, medium, large
    styles[variant], // filled, outlined, ghost
    brandAccentFilledClass,
    brandAccentOutlinedClass,
    disabledClass,
    className
  );
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={buttonAriaLabel}
      disabled={isDisabled}
      className={combinedClassNames}
      onClick={onClick}
      {...props}
    >
      {leftIcon}
      {label && <span>{label}</span>}
      {rightIcon}
    </button>
  );
};
