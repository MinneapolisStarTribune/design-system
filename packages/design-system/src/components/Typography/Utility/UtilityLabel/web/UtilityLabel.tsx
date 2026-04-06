import classNames from 'classnames';
import type { UtilityLabelProps } from '../UtilityLabel.types';

export const UtilityLabel: React.FC<UtilityLabelProps> = ({
  size,
  weight = 'regular',
  capitalize = false,
  children,
  className,
  dataTestId,
  as: Component = 'span',
  ...rest
}) => {
  const weightSegment = weight === 'regular' ? '' : `${weight}-`;
  const typographyClassName = `typography-utility-label-${weightSegment}${size}${capitalize ? '-caps' : ''}`;
  const combinedClassNames = classNames(typographyClassName, className);

  return (
    <Component className={combinedClassNames} data-testid={dataTestId} {...rest}>
      {children}
    </Component>
  );
};

export type {
  UtilityLabelProps,
  UtilityLabelSize,
  UtilityLabelWeight,
} from '../UtilityLabel.types';
