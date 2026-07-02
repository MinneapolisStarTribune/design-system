import React from 'react';
import { ICON_PIXEL_SIZES, type IconSize } from '@/components/Icon/Icon.types';

const ICON_SIZE_TO_PX: Record<IconSize, number> = {
  'x-small': 14,
  small: 16,
  medium: 20,
  large: 24,
  'x-large': 32,
  'checkbox-default': 12,
  'checkbox-small': 10,
};

type IconElement = React.ReactElement<React.SVGProps<SVGSVGElement> & { size?: IconSize }>;

export function getLinkIconSize(icon: React.ReactNode): IconSize {
  if (!icon || !React.isValidElement(icon)) return 'medium';
  return (icon as IconElement).props.size ?? 'medium';
}

/**
 * Icon viewport matches the passed icon's `size` prop (e.g. `x-small` → 14×14).
 * Wrapper span is sized to the icon; SVG dimensions align inside the box.
 */
export function enhanceLinkIcon(icon: React.ReactNode, iconClassName: string): React.ReactNode {
  if (!icon || !React.isValidElement(icon)) return icon;

  const svgIcon = icon as IconElement;
  const iconSize = getLinkIconSize(icon);
  const pixelSize = ICON_PIXEL_SIZES[iconSize];
  const existingClassName = svgIcon.props.className;
  const existingStyle = svgIcon.props.style;
  const mergedStyle: React.CSSProperties = {
    ...(typeof existingStyle === 'object' && existingStyle !== null && !Array.isArray(existingStyle)
      ? existingStyle
      : {}),
    width: pixelSize,
    height: pixelSize,
    color: 'inherit',
  };

  const enhancedSvg = React.cloneElement(svgIcon, {
    width: pixelSize,
    height: pixelSize,
    style: mergedStyle,
    'aria-hidden': true,
    className: existingClassName,
  });

  return React.createElement(
    'span',
    {
      className: iconClassName,
      style: { width: pixelSize, height: pixelSize },
      'aria-hidden': true,
    },
    enhancedSvg
  );
}

/** React Native: clone icon with numeric width/height from its `size` prop. */
export function enhanceLinkIconNative(
  icon: React.ReactElement,
  textColor: string
): React.ReactElement {
  const iconSize = getLinkIconSize(icon);
  const px = ICON_SIZE_TO_PX[iconSize];
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

export function getLinkIconViewportPx(icon: React.ReactNode): number {
  return ICON_SIZE_TO_PX[getLinkIconSize(icon)];
}
