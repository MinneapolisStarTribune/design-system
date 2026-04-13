import classNames from 'classnames';
import type { EditorialSponsoredTextProps } from '../EditorialSponsoredText.types';
import { resolveTextColorStyle } from '@/types';

export const EditorialSponsoredText: React.FC<EditorialSponsoredTextProps> = (props) => {
  const {
    size,
    weight = 'regular',
    children,
    className,
    dataTestId = 'editorial-text-sponsored',
    color,
    style,
    ...restProps
  } = props;
  const typographyClassName = `typography-editorial-text-sponsored-${weight}-${size}`;
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
  EditorialSponsoredTextProps,
  EditorialSponsoredTextSize,
  EditorialSponsoredTextWeight,
} from '../EditorialSponsoredText.types';
