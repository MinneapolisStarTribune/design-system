'use client';

import { useContext } from 'react';
import classNames from 'classnames';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
import {
  EYEBROW_BADGE_SIZES,
  EYEBROW_BADGE_VARIANTS,
  type EyebrowBadgeProps,
  type EyebrowBadgeSize,
  type EyebrowBadgeVariant,
} from '@/components/EyebrowBadge/EyebrowBadge.types';
import { UtilityLabel } from '@/components/Typography/Utility';
import styles from './EyebrowBadge.module.scss';

export {
  EYEBROW_BADGE_SIZES,
  EYEBROW_BADGE_VARIANTS,
  type EyebrowBadgeProps,
  type EyebrowBadgeSize,
  type EyebrowBadgeVariant,
};

export const EyebrowBadge: React.FC<EyebrowBadgeProps> = ({
  label,
  secondaryLabel,
  variant = 'live',
  size = 'large',
  showDot,
  className,
  style,
  dataTestId,
  as: Component = 'span',
  ...accessibilityProps
}) => {
  const dsContext = useContext(DesignSystemContext);
  const isDarkColorScheme = dsContext?.colorScheme === 'dark';

  const shouldShowDot =
    variant === 'breaking' ? false : variant === 'live' ? (showDot ?? true) : (showDot ?? false);

  const labelSize = size === 'small' ? 'small' : 'medium';

  const showcaseDarkSurface =
    variant === 'showcase' && isDarkColorScheme ? styles.showcaseWhenDark : undefined;

  return (
    <Component
      className={classNames(
        styles.eyebrowBadge,
        styles[`variant-${variant}`],
        showcaseDarkSurface,
        size === 'small' ? styles.sizeSmall : styles.sizeLarge,
        className
      )}
      style={style}
      data-testid={dataTestId}
      {...accessibilityProps}
    >
      <span className={styles.badge}>
        {shouldShowDot ? <span className={styles.badgeDot} aria-hidden /> : null}
        <UtilityLabel size={labelSize} weight="semibold" capitalize className={styles.primaryLabel}>
          {label}
        </UtilityLabel>
      </span>

      {secondaryLabel && variant !== 'sponsored' ? (
        <UtilityLabel size={labelSize} weight="semibold" capitalize className={styles.secondaryLabel}>
          {secondaryLabel}
        </UtilityLabel>
      ) : null}
    </Component>
  );
};
