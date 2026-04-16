import React from 'react';
import type { ComponentType } from 'react';
import {
  ICON_PIXEL_SIZES,
  type IconSize,
  type IconWrapperProps,
} from '@/components/Icon/Icon.types';
import { utilityButtonIconFilledVariant } from './utilityButtonIconFilledVariant';
import type { ButtonSize, IconOnlyButtonSize } from '@/components/Button/Button.types';
/**
 * Toggle + active: use the filled wrapped icon when mapped in `utilityButtonIconFilledVariant`; otherwise keep the passed icon.
 */
export function resolveUtilityToggleActiveIcon(
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>> | undefined,
  variant: 'default' | 'toggle' | 'link',
  active: boolean | undefined
): React.ReactElement<React.SVGProps<SVGSVGElement>> | undefined {
  if (!icon || variant !== 'toggle' || !active || !icon.type) return icon;

  const outline = icon.type as ComponentType<IconWrapperProps>;
  const Filled = utilityButtonIconFilledVariant.get(outline);
  if (!Filled) return icon;

  return React.createElement(Filled, {
    ...(icon.props as React.ComponentProps<typeof Filled>),
    key: icon.key ?? undefined,
  }) as React.ReactElement<React.SVGProps<SVGSVGElement>>;
}

/**
 * Get aria-label for accessibility.
 * Uses explicit aria-label, then label prop, then undefined (caller should provide for icon-only).
 */
export function getUtilityButtonAriaLabel(
  explicitAriaLabel: string | undefined,
  label: string | undefined
): string | undefined {
  if (explicitAriaLabel) return explicitAriaLabel;
  if (label) return label;
  // Icon-only buttons should have aria-label - we don't auto-generate from icon name
  return undefined;
}

/**
 * Shared aria-label fallback for Button.
 * Uses explicit aria-label first, then string children.
 */
export function getButtonAriaLabel(
  explicitAriaLabel: string | undefined,
  children: React.ReactNode
): string | undefined {
  if (explicitAriaLabel) return explicitAriaLabel;
  if (typeof children === 'string') return children;
  return undefined;
}

/**
 * Icon size token for a button based on button size and whether it's icon-only (shared web + native).
 */
export function getButtonIconSize(
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

/**
 * Apply standardized sizing/a11y/className to button icons.
 * Accepts `ReactElement` to align with shared `ButtonProps.icon` (web SVGs).
 */
export function enhanceButtonIcon(
  icon: React.ReactElement | undefined,
  iconSize: IconSize | undefined,
  iconClassName: string
): React.ReactElement<React.SVGProps<SVGSVGElement>> | null {
  if (!icon || !icon.type || !iconSize) return null;

  const pixelSize = ICON_PIXEL_SIZES[iconSize];
  const svgIcon = icon as React.ReactElement<React.SVGProps<SVGSVGElement>>;
  const existingClassName = svgIcon.props.className;
  const existingStyle = svgIcon.props.style;
  const mergedStyle: React.CSSProperties = {
    ...(typeof existingStyle === 'object' && existingStyle !== null && !Array.isArray(existingStyle)
      ? existingStyle
      : {}),
    width: pixelSize,
    height: pixelSize,
    /* Override Icon wrapper default token so paths using currentColor match button foreground */
    color: 'inherit',
  };

  return React.cloneElement(svgIcon, {
    width: pixelSize,
    height: pixelSize,
    style: mergedStyle,
    'aria-hidden': true,
    className: existingClassName ? `${iconClassName} ${existingClassName}` : iconClassName,
  });
}

const ICON_SIZE_TO_PX: Record<import('@/components/Icon/Icon.types').IconSize, number> = {
  'x-small': 14,
  small: 16,
  medium: 20,
  large: 24,
  'x-large': 32,
  'checkbox-default': 12,
  'checkbox-small': 10,
};

/**
 * Clone icon for React Native with numeric width/height and inherited color.
 */
export function enhanceButtonIconNative(
  icon: React.ReactElement | undefined,
  iconSizeName: import('@/components/Icon/Icon.types').IconSize | undefined,
  textColor: string
): React.ReactElement | null {
  if (!icon || !iconSizeName) return null;
  const px = ICON_SIZE_TO_PX[iconSizeName];
  const { style: existingStyle } = icon.props as { style?: unknown };
  const flat =
    typeof existingStyle === 'object' && existingStyle !== null && !Array.isArray(existingStyle)
      ? existingStyle
      : {};
  return React.cloneElement(icon, {
    width: px,
    height: px,
    color: textColor,
    style: { ...flat, width: px, height: px },
    accessibilityElementsHidden: true,
    importantForAccessibility: 'no-hide-descendants',
  } as Record<string, unknown>);
}
