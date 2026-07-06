import React, { forwardRef } from 'react';
import classNames from 'classnames';
import {
  LINK_SIZE_TO_UTILITY_BODY_TOKEN,
  type LinkInlineProps,
  type LinkProps,
  type LinkUtilityProps,
} from '../Link.types';
import styles from './Link.module.scss';
import { enhanceLinkIcon } from '../Link.helpers';

/**
 * Text link: **utility** (Utility Body sizes) or **inline** (inherits parent typography; use `InlineLink`).
 *
 * @example Utility — Next.js App Router
 * ```tsx
 * import NextLink from 'next/link';
 * <Link as={NextLink} href="/news" size="medium">Read more</Link>
 * ```
 */
export const Link = forwardRef<HTMLAnchorElement | HTMLButtonElement, LinkProps>((props, ref) => {
  const isInline = props.variant === 'inline';
  const inlineBrand = isInline ? ((props as LinkInlineProps).brand ?? 'startribune') : undefined;

  const {
    as: As = 'a',
    children,
    href,
    disabled = false,
    className,
    dataTestId,
    onClick,
    'aria-label': ariaLabel,
    id,
    title,
    variant: _variant,
    size: _size,
    ...anchorRest
  } = props as LinkUtilityProps & Partial<LinkInlineProps>;

  const icon = isInline ? undefined : (props as LinkUtilityProps).icon;
  const iconPosition = isInline ? 'end' : ((props as LinkUtilityProps).iconPosition ?? 'end');

  const size = ((props as LinkUtilityProps).size ??
    'medium') as keyof typeof LINK_SIZE_TO_UTILITY_BODY_TOKEN;

  const rootClass = classNames(
    styles.link,
    isInline && styles.inline,
    isInline &&
      inlineBrand &&
      (inlineBrand === 'startribune' ? styles.brandStartribune : styles.brandVarsity),
    disabled && styles.disabled,
    className
  );

  const label = isInline ? (
    <span className={styles.inlineLabel}>{children}</span>
  ) : (
    <span className={`typography-utility-text-medium-${LINK_SIZE_TO_UTILITY_BODY_TOKEN[size]}`}>
      {children}
    </span>
  );

  const startIcon = icon && iconPosition === 'start' ? enhanceLinkIcon(icon, styles.icon) : null;
  const endIcon = icon && iconPosition === 'end' ? enhanceLinkIcon(icon, styles.icon) : null;

  const content = (
    <>
      {startIcon}
      {label}
      {endIcon}
    </>
  );

  if (disabled) {
    return (
      <span
        role="link"
        aria-disabled="true"
        tabIndex={-1}
        className={rootClass}
        data-testid={dataTestId}
        aria-label={ariaLabel}
        id={id}
        title={title}
      >
        {content}
      </span>
    );
  }

  const isNativeButton = typeof As === 'string' && As === 'button';
  const sharedProps = {
    className: rootClass,
    'data-testid': dataTestId,
    onClick,
    'aria-label': ariaLabel,
    id,
    title,
    ...anchorRest,
  };

  if (isNativeButton) {
    const buttonProps = sharedProps as unknown as React.ButtonHTMLAttributes<HTMLButtonElement>;

    return (
      <button {...buttonProps} type="button" ref={ref as React.Ref<HTMLButtonElement>}>
        {content}
      </button>
    );
  }

  if (As === 'a') {
    return (
      <a {...sharedProps} href={href ?? '#'} ref={ref as React.Ref<HTMLAnchorElement>}>
        {content}
      </a>
    );
  }

  if (typeof As === 'string') {
    return React.createElement(
      As,
      {
        ...sharedProps,
        href: href ?? '#',
      },
      content
    );
  }

  return React.createElement(
    As,
    {
      ...sharedProps,
      href: href ?? '#',
    },
    content
  );
});

Link.displayName = 'Link';

export type { LinkProps, LinkInlineProps, LinkUtilityProps } from '../Link.types';
