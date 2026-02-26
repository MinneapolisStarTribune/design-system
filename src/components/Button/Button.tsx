import {
  Button as MantineButton,
  ButtonProps as MantineButtonProps,
  useMantineTheme,
} from '@mantine/core';
import classNames from 'classnames';
import { Icon } from '../Icon/Icon';
import { IconName } from '../Icon/iconNames';
import { getIconLabel } from '../../utils/accessibilityHelpers';
import { useAnalytics } from '../../hooks/useAnalytics';
import styles from './Button.module.scss';

export const BUTTON_COLORS = ['neutral', 'brand', 'brand-accent'] as const;
export type ButtonColor = (typeof BUTTON_COLORS)[number];
export const BUTTON_VARIANTS = ['filled', 'outlined', 'ghost'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export const BUTTON_SIZES = ['small', 'medium', 'large'] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];

/** Extra data to merge into the tracking event. Use for per-button context (e.g. cta_type, module_position). */
export type ButtonAnalytics = Record<string, unknown>;

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
  /** Per-button tracking data merged into the event. Use to distinguish buttons (e.g. cta_type, module_name). */
  analytics?: ButtonAnalytics;
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
  onClick,
  analytics: analyticsOverride,
  ...props
}) => {
  const { track } = useAnalytics();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    track({
      event: 'button_click',
      component: 'Button',
      label: label ?? undefined,
      icon: icon ?? undefined,
      variant,
      color,
      ...analyticsOverride,
    });
    onClick?.(e);
  };

  let mantineVariant;
  if (variant === 'ghost') {
    mantineVariant = 'subtle';
  } else {
    mantineVariant = variant;
  }

  // Icons use the same color as text (no separate button-icon tokens needed)
  // Icon is always decorative (aria-hidden) when using the simple icon prop
  // By not passing a color prop, Icon component will use 'currentColor' which inherits the button's text color
  const iconElement = icon ? <Icon name={icon} size={size} aria-hidden={true} /> : null;

  // Extract aria-label from props if provided (using type assertion for HTML attributes)
  const ariaLabel = (props as React.ButtonHTMLAttributes<HTMLButtonElement>)['aria-label'];

  // Generate aria-label: use explicit aria-label, fallback to label, or generate from icon name for icon-only buttons
  const buttonAriaLabel = ariaLabel || label || (icon ? `${getIconLabel(icon)} icon` : undefined);

  // Use Mantine's leftSection/rightSection for icon positioning
  const leftSection = icon && iconPosition === 'start' ? iconElement : undefined;
  const rightSection = icon && iconPosition === 'end' ? iconElement : undefined;

  // Check if brand-accent buttons should have gradient border
  // Check the theme colors directly to see if the hover-border token is a gradient
  const theme = useMantineTheme();
  const isBrandAccentFilled = color === 'brand-accent' && variant === 'filled';
  const isBrandAccentOutlined = color === 'brand-accent' && variant === 'outlined';
  const brandAccentFilledHoverBorder = theme.colors['button-brand-accent-filled-hover-border']?.[0];
  const brandAccentOutlinedHoverBorder =
    theme.colors['button-brand-accent-outlined-hover-border']?.[0];
  const hasGradientBorderFilled =
    isBrandAccentFilled && brandAccentFilledHoverBorder?.includes('gradient');
  const hasGradientBorderOutlined =
    isBrandAccentOutlined && brandAccentOutlinedHoverBorder?.includes('gradient');

  // Apply special hover styles for brand-accent buttons with gradient border
  const brandAccentFilledClass =
    isBrandAccentFilled && hasGradientBorderFilled ? styles.brandAccentFilled : undefined;
  const brandAccentOutlinedClass =
    isBrandAccentOutlined && hasGradientBorderOutlined ? styles.brandAccentOutlined : undefined;

  // Add disabled class for styling
  const disabledClass = isDisabled ? styles.disabled : undefined;

  // Combine class names using classnames utility
  const combinedClassNames = classNames(
    className,
    brandAccentFilledClass,
    brandAccentOutlinedClass,
    disabledClass
  );

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
      onClick={handleClick}
      {...props}
    >
      {label}
    </MantineButton>
  );
};
