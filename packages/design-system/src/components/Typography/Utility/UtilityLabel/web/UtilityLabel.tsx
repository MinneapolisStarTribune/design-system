import classNames from 'classnames';
import type { UtilityLabelProps } from '../UtilityLabel.types';
import { resolveTextColorStyle } from '@/types';

export const UtilityLabel: React.FC<UtilityLabelProps> = ({
  size,
  weight = 'regular',
  capitalize = false,
  children,
  className,
  dataTestId,
  as: Component = 'span',
  color,
  style,
  ...rest
}) => {
  const weightSegment = weight === 'regular' ? '' : `${weight}-`;
  const typographyClassName = `typography-utility-label-${weightSegment}${size}${capitalize ? '-caps' : ''}`;
  const combinedClassNames = classNames(typographyClassName, className);

  return (
    <Component
      className={combinedClassNames}
      data-testid={dataTestId}
      style={resolveTextColorStyle(color, style)}
      {...rest}
    >
      {children}
    </Component>
  );
};

export type {
  UtilityLabelProps,
  UtilityLabelSize,
  UtilityLabelWeight,
} from '../UtilityLabel.types';
