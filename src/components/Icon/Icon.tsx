import { iconOptions } from './iconOptions';
import { IconName } from './iconNames';
import { twMerge } from 'tailwind-merge';
import {
  BaseProps,
  AccessibilityProps,
  IconSpecificProps,
  IconColor,
  ICON_COLORS,
} from '../../types/globalTypes';

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

  return (
    <IconComponent
      width={sizeValue}
      height={sizeValue}
      className={twMerge('ds:inline-flex ds:items-center ds:justify-center', className)}
      fill={color ? `var(--color-icon-${color})` : 'currentColor'}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-hidden={ariaHidden}
      data-testid={dataTestId}
    />
  );
};
