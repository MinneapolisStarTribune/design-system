import classNames from 'classnames';
import type { IconSize } from '@/components/Icon/Icon.types';
import { KeyIcon, LogoStribBlackIcon, LogoVarsityIcon } from '@/icons';
import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/web/UtilityLabel';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
import type { EyebrowLabelProps, EyebrowLabelSize } from '../EyebrowLabel.types';
import { useContext } from 'react';
import styles from './EyebrowLabel.module.scss';

const TYPOGRAPHY_BY_SIZE: Record<EyebrowLabelSize, 'small' | 'medium' | 'large'> = {
  small: 'small',
  medium: 'medium',
  large: 'large',
};

const SUBSCRIBER_KEY_ICON_SIZE: Record<EyebrowLabelSize, IconSize> = {
  small: 'x-small',
  medium: 'small',
  large: 'small',
};

export const EyebrowLabel: React.FC<EyebrowLabelProps> = ({
  children,
  label,
  size = 'medium',
  color = 'neutral',
  logo = false,
  logoColor,
  isSubscriberOnly = false,
  isBackground = false,
  background,
  brand,
  as = 'span',
  className,
  dataTestId,
  htmlFor,
  style,
  ...rest
}) => {
  const context = useContext(DesignSystemContext);
  const resolvedBrand = brand ?? context?.brand ?? 'startribune';
  const resolvedBackground = background ?? (isBackground ? 'on-dark' : 'on-light');
  const labelText = label ?? children;
  const Component = as;
  const toneClassName =
    color === 'brand'
      ? resolvedBackground === 'on-light'
        ? styles.brandOnLight
        : styles.brandOnDark
      : styles[`${color}-${resolvedBackground}`];
  const showLiveDot = color === 'live';
  /** Live and subscriber-only: no brand logo (only indicator + label). */
  const showBrandLogo = logo && color !== 'live' && !isSubscriberOnly;
  const typographySize = TYPOGRAPHY_BY_SIZE[size];

  const logoIconCommonProps = {
    className: styles.logo,
    'aria-hidden': true as const,
    ...(logoColor !== undefined ? { color: logoColor } : { style: { color: 'inherit' as const } }),
  };

  return (
    <Component
      className={classNames(styles.eyebrowLabel, styles[size], toneClassName, className)}
      data-testid={dataTestId}
      htmlFor={as === 'label' ? htmlFor : undefined}
      style={style}
      {...rest}
    >
      {showBrandLogo && resolvedBrand === 'startribune' && (
        <LogoStribBlackIcon {...logoIconCommonProps} />
      )}
      {showBrandLogo && resolvedBrand === 'varsity' && <LogoVarsityIcon {...logoIconCommonProps} />}
      {isSubscriberOnly && (
        <span className={styles.subscriberIcon} aria-hidden>
          <KeyIcon size={SUBSCRIBER_KEY_ICON_SIZE[size]} style={{ color: 'inherit' }} />
        </span>
      )}
      {showLiveDot && (
        <span className={styles.liveDot} aria-hidden>
          •
        </span>
      )}
      <UtilityLabel size={typographySize} weight="semibold" capitalize className={styles.label}>
        {labelText}
      </UtilityLabel>
    </Component>
  );
};

export type {
  EyebrowLabelBackground,
  EyebrowLabelAsElement,
  EyebrowLabelColor,
  EyebrowLabelProps,
  EyebrowLabelSize,
} from '../EyebrowLabel.types';
export {
  EYEBROW_LABEL_AS_ELEMENTS,
  EYEBROW_LABEL_BACKGROUNDS,
  EYEBROW_LABEL_COLORS,
  EYEBROW_LABEL_SIZES,
} from '../EyebrowLabel.types';
