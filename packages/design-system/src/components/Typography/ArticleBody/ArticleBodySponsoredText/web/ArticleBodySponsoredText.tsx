import classNames from 'classnames';
import { resolveTextColorStyle } from '@/types/globalTypes';
import type { ArticleBodySponsoredTextProps } from '../ArticleBodySponsoredText.types';

export const ArticleBodySponsoredText: React.FC<ArticleBodySponsoredTextProps> = (props) => {
  const {
    weight = 'regular',
    children,
    className,
    dataTestId = 'article-body-text-sponsored',
    color,
    style,
    ...restProps
  } = props;

  const typographyClassName = `typography-article-body-sponsored-${weight}`;
  const combinedClassName = classNames(typographyClassName, className);

  return (
    <p
      className={combinedClassName}
      style={resolveTextColorStyle(color, style)}
      data-testid={dataTestId}
      {...restProps}
    >
      {children}
    </p>
  );
};

export type {
  ArticleBodySponsoredTextProps,
  ArticleBodySponsoredTextWeight,
} from '../ArticleBodySponsoredText.types';
