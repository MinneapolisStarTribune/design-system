import { resolveTextColorStyle } from '@/types';
import type { ArticleQuoteProps } from '../ArticleQuote.types';
import classNames from 'classnames';

export const ArticleQuote: React.FC<ArticleQuoteProps> = (props) => {
  const {
    size = 'large',
    children,
    className,
    dataTestId = 'article-quote',
    color,
    style,
    ...rest
  } = props;

  const typographyClassName = `typography-article-quote-${size}`;
  const combinedClassName = classNames(typographyClassName, className);

  return (
    <blockquote
      className={combinedClassName}
      data-testid={dataTestId}
      style={resolveTextColorStyle(color, style)}
      {...rest}
    >
      {children}
    </blockquote>
  );
};

ArticleQuote.displayName = 'ArticleQuote';
export type { ArticleQuoteProps };
