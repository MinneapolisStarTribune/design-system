'use client';

import classNames from 'classnames';
import {
  EYEBROW_BADGE_VARIANTS,
  type EyebrowBadgeProps,
  type EyebrowBadgeVariant,
} from '@/components/EyebrowBadge/EyebrowBadge.types';
import { UtilityLabel } from '@/components/Typography/Utility';
import styles from './EyebrowBadge.module.scss';

export { EYEBROW_BADGE_VARIANTS, type EyebrowBadgeProps, type EyebrowBadgeVariant };

export const EyebrowBadge: React.FC<EyebrowBadgeProps> = ({
  label,
  secondaryLabel,
  variant = 'live',
  showDot,
  className,
  style,
  dataTestId,
  as: Component = 'span',
  ...accessibilityProps
}) => {
  const shouldShowDot =
    variant === 'breaking' ? false : variant === 'live' ? (showDot ?? true) : (showDot ?? false);

  return (
    <Component
      className={classNames(styles.eyebrowBadge, styles[`variant-${variant}`], className)}
      style={style}
      data-testid={dataTestId}
      {...accessibilityProps}
    >
      <span className={styles.badge}>
        {shouldShowDot ? <span className={styles.badgeDot} aria-hidden /> : null}
        <UtilityLabel size="medium" weight="semibold" capitalize className={styles.primaryLabel}>
          {label}
        </UtilityLabel>
      </span>

      {secondaryLabel && variant !== 'sponsored' ? (
        <UtilityLabel size="medium" weight="semibold" capitalize className={styles.secondaryLabel}>
          {secondaryLabel}
        </UtilityLabel>
      ) : null}
    </Component>
  );
};
