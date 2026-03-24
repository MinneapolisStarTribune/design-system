import React from 'react';
import { ICON_PIXEL_SIZES, type IconSize } from '@/components/Icon/Icon.types';

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
 * Apply standardized sizing/a11y/className to button icons.
 */
export function enhanceButtonIcon(
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>> | undefined,
  iconSize: IconSize | undefined,
  iconClassName: string
): React.ReactElement<React.SVGProps<SVGSVGElement>> | null {
  if (!icon || !icon.type || !iconSize) return null;

  const pixelSize = ICON_PIXEL_SIZES[iconSize];
  const existingClassName = icon.props.className;
  const existingStyle = icon.props.style;
  const mergedStyle: React.CSSProperties = {
    ...(typeof existingStyle === 'object' && existingStyle !== null && !Array.isArray(existingStyle)
      ? existingStyle
      : {}),
    width: pixelSize,
    height: pixelSize,
    /* Override Icon wrapper default token so paths using currentColor match button foreground */
    color: 'inherit',
  };

  return React.cloneElement(icon, {
    width: pixelSize,
    height: pixelSize,
    style: mergedStyle,
    'aria-hidden': true,
    className: existingClassName ? `${iconClassName} ${existingClassName}` : iconClassName,
  });
}
