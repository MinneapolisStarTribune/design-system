import React from 'react';
import classNames from 'classnames';
import styles from './UtilityButton.module.scss';
import { UtilityLabel } from '@/components/Typography/Utility';
import { BaseProps } from '@/types/globalTypes';
import type { Size } from '@/types/globalTypes';
import { ICON_PIXEL_SIZES, type IconSize } from '@/components/Icon/Icon.types';

export const UTILITY_BUTTON_VARIANTS = ['default', 'toggle', 'link'] as const;
export type UtilityButtonVariant = (typeof UTILITY_BUTTON_VARIANTS)[number];

export const UTILITY_BUTTON_SIZES = ['small', 'large'] as const;
export type UtilityButtonSize = Extract<Size, 'small' | 'large'>;

/**
 * Utility button icon size mapping.
 * Small: 16px, Large: 24px (per Figma spec).
 */
function getUtilityButtonIconSize(size: UtilityButtonSize): IconSize {
  return size === 'small' ? 'small' : 'large';
}

/**
 * Get aria-label for accessibility.
 * Uses explicit aria-label, then label prop, then undefined (caller should provide for icon-only).
 */
function getUtilityButtonAriaLabel(
  explicitAriaLabel: string | undefined,
  label: string | undefined,
  isIconOnly: boolean
): string | undefined {
  if (explicitAriaLabel) return explicitAriaLabel;
  if (label) return label;
  // Icon-only buttons should have aria-label - we don't auto-generate from icon name
  return undefined;
}

function enhanceIcon(
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>,
  iconSize: IconSize
): React.ReactElement<React.SVGProps<SVGSVGElement>> {
  const pixelSize = ICON_PIXEL_SIZES[iconSize];
  const existingClassName = icon.props.className;
  return React.cloneElement(icon, {
    width: pixelSize,
    height: pixelSize,
    'aria-hidden': true,
    className: existingClassName ? classNames(styles.icon, existingClassName) : styles.icon,
  });
}

export interface UtilityButtonProps extends BaseProps {
  variant?: UtilityButtonVariant;
  size?: UtilityButtonSize;
  /** Optional icon element (e.g. icon={<Share02Icon />}) */
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  iconPosition?: 'start' | 'end';
  isDisabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Button label. When absent with an icon, renders icon-only. */
  label?: string;
}

export const UtilityButton: React.FC<UtilityButtonProps> = ({
  variant = 'default',
  size = 'large',
  icon,
  iconPosition = 'start',
  isDisabled,
  onClick,
  label,
  className,
  ...props
}) => {
  const hasIcon = !!icon;
  const isIconOnly = hasIcon && !label;

  const iconSize = hasIcon ? getUtilityButtonIconSize(size) : undefined;
  const leftIcon =
    hasIcon && (isIconOnly || iconPosition === 'start') ? enhanceIcon(icon!, iconSize!) : null;
  const rightIcon =
    hasIcon && !isIconOnly && iconPosition === 'end' ? enhanceIcon(icon!, iconSize!) : null;

  const ariaLabel = (props as React.ButtonHTMLAttributes<HTMLButtonElement>)['aria-label'];
  const buttonAriaLabel = getUtilityButtonAriaLabel(ariaLabel, label, isIconOnly);

  const combinedClassNames = classNames(
    styles.utilityButton,
    styles[variant],
    styles[size],
    isIconOnly && styles['icon-only'],
    hasIcon && !isIconOnly && styles.hasIcon,
    isDisabled && styles.disabled,
    className
  );

  // Map UtilityButton size to UtilityLabel size (small->small, large->large)
  const labelSize = size === 'small' ? 'small' : 'large';

  return (
    <button
      type="button"
      aria-label={buttonAriaLabel}
      disabled={isDisabled}
      className={combinedClassNames || undefined}
      onClick={onClick}
      {...props}
    >
      {leftIcon}
      {!isIconOnly && label && (
        <UtilityLabel size={labelSize} weight="semibold">
          {label}
        </UtilityLabel>
      )}
      {rightIcon}
    </button>
  );
};
