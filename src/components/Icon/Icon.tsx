import { iconOptions } from './iconOptions';
import { IconName } from './iconNames';
import {
  BaseProps,
  AccessibilityProps,
  IconSpecificProps,
  IconColor,
  ICON_COLORS,
} from '../../types/globalTypes';
import styles from './Icon.module.scss';

export type IconProps = BaseProps & AccessibilityProps & IconSpecificProps<IconName>;

export const Icon = ({
  name,
  color,
  className = '',
  size = 'medium',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-hidden': ariaHidden = true,
  dataTestId,
}: IconProps) => {
  const IconComponent = iconOptions[name];

  if (!IconComponent) {
    if (typeof console !== 'undefined' && console.error) {
      console.error(`Icon "${name}" not found in iconOptions`);
    }
    return null;
  }

  if (color && !ICON_COLORS.includes(color as IconColor)) {
    if (typeof console !== 'undefined' && console.error) {
      console.error(`Invalid icon color "${color}". Must be one of: ${ICON_COLORS.join(', ')}`);
    }
    color = undefined;
  }

  // Size mapping
  const sizeMap: Record<'small' | 'medium' | 'large', string> = {
    small: '14px',
    medium: '16px',
    large: '24px',
  };
  const sizeValue = sizeMap[size];

  // Combine CSS module class with any additional className
  const combinedClassName = className 
    ? `${styles.icon} ${className}`.trim()
    : styles.icon;

  return (
    <IconComponent
      width={sizeValue}
      height={sizeValue}
      className={combinedClassName}
      fill={color ? `var(--color-icon-${color})` : 'currentColor'}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-hidden={ariaHidden}
      data-testid={dataTestId}
    />
  );
};
