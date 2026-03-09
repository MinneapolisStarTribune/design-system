import classNames from 'classnames';
import type { UtilityBodyProps } from '../UtilityBody.types';

export const UtilityBody: React.FC<UtilityBodyProps> = ({
  size = 'medium',
  weight = 'regular',
  className,
  children,
  dataTestId,
  style,
  ...props
}) => {
  const typographyClassName = `typography-utility-text-${weight}-${size}`;

  return (
    <p
      className={classNames(typographyClassName, className)}
      data-testid={dataTestId}
      style={style}
      {...props}
    >
      {children}
    </p>
  );
};

UtilityBody.displayName = 'UtilityBody';

export type { UtilityBodyProps, UtilityBodySize, UtilityBodyWeight } from '../UtilityBody.types';
