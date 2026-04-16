import classNames from 'classnames';
import type { ArticleBodyTextProps } from '../ArticleBodyText.types';
import { resolveTextColorStyle } from '@/types';

export const ArticleBodyText: React.FC<ArticleBodyTextProps> = (props) => {
  const {
    weight = 'regular',
    children,
    dataTestId = 'article-body-text',
    className,
    color,
    style,
    ...rest
  } = props;

  const typographyClassName = `typography-article-body-${weight}`;
  const combinedClassNames = classNames(typographyClassName, className);

  return (
    <p
      className={combinedClassNames}
      data-testid={dataTestId}
      style={resolveTextColorStyle(color, style)}
      {...rest}
    >
      {children}
    </p>
  );
};

export type { ArticleBodyTextProps, ArticleBodyTextWeight } from '../ArticleBodyText.types';
