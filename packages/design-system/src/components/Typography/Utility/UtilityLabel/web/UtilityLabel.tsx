import classNames from 'classnames';
import type { UtilityLabelProps } from '../UtilityLabel.types';

export const UtilityLabel: React.FC<UtilityLabelProps> = ({
  size,
  weight = 'regular',
  capitalize = false,
  children,
  className,
  dataTestId,
  ...rest
}) => {
  const weightSegment = weight === 'regular' ? '' : `${weight}-`;
  const typographyClassName = `typography-utility-label-${weightSegment}${size}${capitalize ? '-caps' : ''}`;
  const combinedClassNames = classNames(typographyClassName, className);

  return (
    <span className={combinedClassNames} data-testid={dataTestId} {...rest}>
      {children}
    </span>
  );
};

export type {
  UtilityLabelProps,
  UtilityLabelSize,
  UtilityLabelWeight,
} from '../UtilityLabel.types';
