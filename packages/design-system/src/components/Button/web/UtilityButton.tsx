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
 * - Large + label: small (16px)
 * - Large + icon-only: medium (20px)
 * - Small + label: x-small (14px)
 * - Small + icon-only: small (16px)
 */
function getUtilityButtonIconSize(size: UtilityButtonSize, isIconOnly: boolean): IconSize {
  if (size === 'large') {
    return isIconOnly ? 'medium' : 'small';
  }

  return isIconOnly ? 'small' : 'x-small';
}

/**
 * Get aria-label for accessibility.
 * Uses explicit aria-label, then label prop, then undefined (caller should provide for icon-only).
 */
function getUtilityButtonAriaLabel(
  explicitAriaLabel: string | undefined,
  label: string | undefined
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
  // Icons from createIconWrapper set width/height via inline `style` (default medium = 20px).
  // Those styles override width/height attributes, so merge style and force our dimensions.
  const existingStyle = icon.props.style;
  const mergedStyle: React.CSSProperties = {
    ...(typeof existingStyle === 'object' && existingStyle !== null && !Array.isArray(existingStyle)
      ? existingStyle
      : {}),
    width: pixelSize,
    height: pixelSize,
  };
  return React.cloneElement(icon, {
    width: pixelSize,
    height: pixelSize,
    style: mergedStyle,
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

  const iconSize = hasIcon ? getUtilityButtonIconSize(size, isIconOnly) : undefined;
  const leftIcon =
    hasIcon && (isIconOnly || iconPosition === 'start') ? enhanceIcon(icon!, iconSize!) : null;
  const rightIcon =
    hasIcon && !isIconOnly && iconPosition === 'end' ? enhanceIcon(icon!, iconSize!) : null;

  const ariaLabel = (props as React.ButtonHTMLAttributes<HTMLButtonElement>)['aria-label'];
  const buttonAriaLabel = getUtilityButtonAriaLabel(ariaLabel, label);

  const combinedClassNames = classNames(
    styles.utilityButton,
    styles[variant],
    styles[size],
    isIconOnly && styles['icon-only'],
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
