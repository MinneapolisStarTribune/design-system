import classNames from 'classnames';
import type { EditorialTextProps } from '../EditorialText.types';
import { resolveTextColorStyle } from '@/types';

export const EditorialText: React.FC<EditorialTextProps> = (props) => {
  const {
    size,
    weight = 'regular',
    children,
    className,
    dataTestId = 'editorial-text',
    color,
    style,
    ...restProps
  } = props;
  const typographyClassName = `typography-editorial-text-${weight}-${size}`;
  const combinedClassName = classNames(typographyClassName, className);

  return (
    <p
      className={combinedClassName}
      data-testid={dataTestId}
      style={resolveTextColorStyle(color, style)}
      {...restProps}
    >
      {children}
    </p>
  );
};

export type {
  EditorialTextProps,
  EditorialTextSize,
  EditorialTextWeight,
} from '../EditorialText.types';
