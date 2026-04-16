'use client';

import { useEffect, useRef, useState } from 'react';
import type { ElementType, KeyboardEventHandler, MouseEventHandler } from 'react';
import classNames from 'classnames';
import { useAnalytics } from '@/hooks/useAnalytics';
import styles from './Button.module.scss';
import { UtilityLabel } from '@/components/Typography/Utility';
import { createDesignSystemError } from '@/utils/errorPrefix';
import { enhanceButtonIcon, getButtonAriaLabel } from '../Helpers';
import type { ButtonProps, ButtonSize } from './Button.types';
import {
  getButtonIconSize,
  getButtonTokenPrefix,
  getCSSVariable,
  isHtmlButtonTag,
} from './Button.utils';

export type {
  ButtonAnalytics,
  ButtonColor,
  ButtonOwnProps,
  ButtonProps,
  ButtonRouterLinkProps,
  ButtonSharedProps,
  ButtonSize,
  ButtonVariant,
  IconOnlyButtonSize,
} from './Button.types';

export {
  BUTTON_COLORS,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  ICON_ONLY_BUTTON_SIZES,
} from './Button.types';

/**
 * Web `Button` (polymorphic via `as`). Prop docs live in `Button.types.ts`;
 * token/CSS helpers (`getButtonTokenPrefix`, etc.) live in `Button.utils.ts`.
 */
export function Button(props: ButtonProps) {
  const {
    as,
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
    onClick: userOnClick,
    onKeyDown: userOnKeyDown,
    analytics: analyticsOverride,
    surface = 'light',
    style,
    dataTestId,
    'aria-label': ariaLabelProp,
    /** Strip so non-`<button>` roots never receive invalid native `disabled`. */
    disabled: _omitDisabled,
    ...domRest
  } = props;

  const Comp = (as ?? 'button') as ElementType;
  const rootIsHtmlButton = isHtmlButtonTag(Comp);

  const { track } = useAnalytics();
  const buttonRef = useRef<HTMLElement | null>(null);
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

  const handleClick: MouseEventHandler<HTMLElement> = (e) => {
    if (isDisabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    const label = typeof children === 'string' ? children : undefined;

    // Analytics: merge label, variant, color, and optional per-button `analytics` override
    track({
      event: 'button_click',
      component: 'Button',
      label,
      icon: icon ?? undefined,
      variant,
      color,
      ...analyticsOverride,
    });
    userOnClick?.(e);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLElement> = (e) => {
    // Non-`<button>` roots: block Enter/Space from activating when disabled (no native `disabled`)
    if (isDisabled && !rootIsHtmlButton && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
    }
    (userOnKeyDown as KeyboardEventHandler<HTMLElement> | undefined)?.(e);
  };

  // Build token prefix for CSS variables (see `getButtonTokenPrefix` in Button.utils.ts for naming)
  const tokenPrefix = getButtonTokenPrefix(color, variant);

  // Varsity / brand-accent: detect gradient hover border so we can apply mask-based border styles
  useEffect(() => {
    let nextHasGradientBorder = false;

    if (
      color === 'brand-accent' &&
      (variant === 'filled' || variant === 'outlined') &&
      buttonRef.current
    ) {
      const hoverBorderVar = `--color-${tokenPrefix}-hover-border`;
      const hoverBorderValue = getCSSVariable(buttonRef.current, hoverBorderVar);
      // e.g. linear-gradient(...) from tokens — enables `.brand-accent-filled` / `.brand-accent-outlined`
      nextHasGradientBorder = !!(hoverBorderValue && hoverBorderValue.includes('gradient'));
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasGradientBorder(nextHasGradientBorder);
  }, [color, variant, tokenPrefix]);

  // Map button size + icon-only mode to design-system icon size tokens
  const iconSizeName = hasAnyIcon ? getButtonIconSize(size, isIconOnly) : undefined;

  const leftIcon =
    hasAnyIcon && (isIconOnly || iconPosition === 'start')
      ? enhanceButtonIcon(icon, iconSizeName, styles.icon)
      : null;
  const rightIcon =
    hasAnyIcon && !isIconOnly && iconPosition === 'end'
      ? enhanceButtonIcon(icon, iconSizeName, styles.icon)
      : null;

  // Accessible name: explicit `aria-label` or string `children`
  const buttonAriaLabel = getButtonAriaLabel(ariaLabelProp, children);

  // Apply special classes when brand-accent uses gradient borders (see SCSS)
  const brandAccentFilledClass =
    color === 'brand-accent' && variant === 'filled' && hasGradientBorder
      ? styles['brand-accent-filled']
      : undefined;
  const brandAccentOutlinedClass =
    color === 'brand-accent' && variant === 'outlined' && hasGradientBorder
      ? styles['brand-accent-outlined']
      : undefined;

  const sizeClass =
    size === 'x-small' && isIconOnly ? styles['x-small'] : styles[size as ButtonSize];

  // Combine CSS module classes (color, variant, size, icon layout, disabled, dark surface)
  const combinedClassNames = classNames(
    styles.button,
    styles[color],
    sizeClass,
    styles[variant],
    brandAccentFilledClass,
    brandAccentOutlinedClass,
    isIconOnly && styles['icon-only'],
    icon && !isIconOnly && styles.hasIcon, // icon + text: gap/layout
    isDisabled && styles.disabled,
    surface === 'dark' && styles.surfaceDark,
    className
  );

  const inner = (
    <>
      {leftIcon}
      {!isIconOnly && (
        <UtilityLabel size={size as ButtonSize} weight="semibold" capitalize={capitalize}>
          {children}
        </UtilityLabel>
      )}
      {rightIcon}
    </>
  );

  const testIdProps = dataTestId != null ? { 'data-testid': dataTestId } : {};

  /** Build without `ref` first — mutating a props object that includes `ref` triggers `react-hooks/refs`. */
  const elementProps = {
    ...domRest,
    className: combinedClassNames || undefined,
    style,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    'aria-label': buttonAriaLabel,
    ...testIdProps,
    ...(rootIsHtmlButton
      ? { type, disabled: isDisabled }
      : isDisabled
        ? { 'aria-disabled': true as const, tabIndex: -1 }
        : {}),
  };

  return (
    <Comp ref={buttonRef} {...elementProps}>
      {inner}
    </Comp>
  );
}

Button.displayName = 'Button';
