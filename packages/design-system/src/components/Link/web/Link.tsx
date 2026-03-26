import React from 'react';
import classNames from 'classnames';
import { LINK_SIZE_TO_UTILITY_BODY_TOKEN, type LinkProps } from '../Link.types';
import styles from './Link.module.scss';

/**
 * Text link using Utility Body typography (weight medium) in small, medium, or large.
 * Optional leading or trailing icon (never both positions).
 *
 * @example Next.js App Router
 * ```tsx
 * import NextLink from 'next/link';
 * <Link as={NextLink} href="/news" size="medium">Read more</Link>
 * ```
 */
export const Link: React.FC<LinkProps> = ({
  as: As = 'a',
  children,
  size,
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
  ...anchorRest
}) => {
  const typographyClass = `typography-utility-text-medium-${LINK_SIZE_TO_UTILITY_BODY_TOKEN[size]}`;
  const rootClass = classNames(styles.link, disabled && styles.disabled, className);

  const label = <span className={typographyClass}>{children}</span>;

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

  return React.createElement(
    As,
    {
      className: rootClass,
      href: href ?? '#',
      'data-testid': dataTestId,
      onClick,
      'aria-label': ariaLabel,
      id,
      title,
      ...anchorRest,
    },
    content
  );
};

Link.displayName = 'Link';

export type { LinkProps } from '../Link.types';
