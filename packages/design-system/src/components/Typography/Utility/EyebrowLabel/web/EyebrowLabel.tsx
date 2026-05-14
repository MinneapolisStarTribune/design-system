import classNames from 'classnames';
import { Icon } from '@/components/Icon/Icon';
import type { IconSize } from '@/components/Icon/Icon.types';
import { KeyIcon, LogoStribBlackIcon, LogoVarsityIcon } from '@/icons';
import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/web/UtilityLabel';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
import type {
  EyebrowLabelCustomIconProps,
  EyebrowLabelProps,
  EyebrowLabelSize,
} from '../EyebrowLabel.types';
import { cloneElement, isValidElement, useContext } from 'react';
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

const LIVE_DOT_ICON_SIZE: Record<EyebrowLabelSize, IconSize> = {
  small: 'x-small',
  medium: 'x-small',
  large: 'small',
};

const LiveDotSvg: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="8" cy="8" r="4" fill="currentColor" />
  </svg>
);

export const EyebrowLabel: React.FC<EyebrowLabelProps> = ({
  children,
  label,
  size = 'medium',
  color = 'neutral',
  logo = false,
  logoColor,
  customIcon,
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
  const showCustomIcon = Boolean(customIcon) && color !== 'live' && !isSubscriberOnly;
  /** Live and subscriber-only: no brand logo (only indicator + label). */
  const showBrandLogo = logo && color !== 'live' && !isSubscriberOnly && !showCustomIcon;
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
      {showCustomIcon &&
        isValidElement<EyebrowLabelCustomIconProps>(customIcon) &&
        cloneElement(customIcon, {
          className: classNames(styles.logo, customIcon.props.className),
          'aria-hidden': customIcon.props['aria-hidden'] ?? true,
        })}
      {isSubscriberOnly && (
        <span className={styles.subscriberIcon} aria-hidden>
          <KeyIcon size={SUBSCRIBER_KEY_ICON_SIZE[size]} style={{ color: 'inherit' }} />
        </span>
      )}
      {showLiveDot && (
        <Icon
          component={LiveDotSvg}
          size={LIVE_DOT_ICON_SIZE[size]}
          className={styles.liveDot}
          style={{ color: 'inherit' }}
          aria-hidden
        />
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
