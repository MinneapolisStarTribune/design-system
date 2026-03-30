import React from 'react';
import classNames from 'classnames';
import {
  LINK_SIZE_TO_UTILITY_BODY_TOKEN,
  type LinkInlineProps,
  type LinkProps,
  type LinkUtilityProps,
} from '../Link.types';
import styles from './Link.module.scss';

/**
 * Text link: **utility** (Utility Body sizes) or **inline** (inherits parent typography; use `InlineLink`).
 *
 * @example Utility — Next.js App Router
 * ```tsx
 * import NextLink from 'next/link';
 * <Link as={NextLink} href="/news" size="medium">Read more</Link>
 * ```
 */
export const Link: React.FC<LinkProps> = (props) => {
  const isInline = props.variant === 'inline';

  const {
    as: As = 'a',
    children,
    href,
    disabled = false,
    icon,
    iconPosition = 'end',
    className,
    dataTestId,
    onClick,
    'aria-label': ariaLabel,
    id,
    title,
    variant: _variant,
    brand,
    size: _size,
    ...anchorRest
  } = props as LinkUtilityProps & Partial<LinkInlineProps>;

  const rootClass = classNames(
    styles.link,
    isInline && styles.inline,
    isInline &&
      brand &&
      (brand === 'startribune' ? styles.brandStartribune : styles.brandVarsity),
    disabled && styles.disabled,
    className
  );

  const label = isInline ? (
    <span className={styles.inlineLabel}>{children}</span>
  ) : (
    <span
      className={`typography-utility-text-medium-${LINK_SIZE_TO_UTILITY_BODY_TOKEN[(props as LinkUtilityProps).size]}`}
    >
      {children}
    </span>
  );

  const content = (
    <>
      {icon && iconPosition === 'start' ? (
        <span className={styles.icon} aria-hidden>
          {icon}
        </span>
      ) : null}
      {label}
      {icon && iconPosition === 'end' ? (
        <span className={styles.icon} aria-hidden>
          {icon}
        </span>
      ) : null}
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

  const rootProps = isNativeButton
    ? {
        type: 'button' as const,
        className: rootClass,
        'data-testid': dataTestId,
        onClick,
        'aria-label': ariaLabel,
        id,
        title,
        ...anchorRest,
      }
    : {
        className: rootClass,
        href: href ?? '#',
        'data-testid': dataTestId,
        onClick,
        'aria-label': ariaLabel,
        id,
        title,
        ...anchorRest,
      };

  return React.createElement(As, rootProps, content);
};

Link.displayName = 'Link';

export type { LinkProps, LinkInlineProps, LinkUtilityProps } from '../Link.types';
