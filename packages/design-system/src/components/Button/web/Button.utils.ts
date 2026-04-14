import type { ElementType } from 'react';
import type { IconSize } from '@/components/Icon/Icon.types';
import type { ButtonColor, ButtonSize, ButtonVariant, IconOnlyButtonSize } from './Button.types';

/**
 * Build CSS variable name for button tokens
 * Examples:
 * - neutral + filled -> 'button-filled'
 * - brand + outlined -> 'button-brand-outlined'
 * - brand-accent + ghost -> 'button-brand-accent-ghost'
 */
export function getButtonTokenPrefix(color: ButtonColor, variant: ButtonVariant): string {
  if (color === 'neutral') {
    return `button-${variant}`;
  }
  if (color === 'brand') {
    return `button-brand-${variant}`;
  }
  return `button-brand-accent-${variant}`;
}

/**
 * Get CSS variable value from computed styles
 */
export function getCSSVariable(element: HTMLElement | null, variableName: string): string | null {
  if (!element || typeof window === 'undefined') {
    return null;
  }
  const computed = window.getComputedStyle(element);
  return computed.getPropertyValue(variableName).trim() || null;
}

/**
 * Get icon size token for a button based on button size and whether it's icon-only.
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

/** True when the root will render as a real HTML `<button>` (vs `<a>` or a custom component). */
export function isHtmlButtonTag(Comp: ElementType): boolean {
  return Comp === 'button';
}
