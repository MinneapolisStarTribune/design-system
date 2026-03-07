import type { ArticleQuoteProps } from '../ArticleQuote.types';
import classNames from 'classnames';

export const ArticleQuote: React.FC<ArticleQuoteProps> = (props) => {
  const { size = 'large', children, className, dataTestId = 'article-quote', ...rest } = props;

  const typographyClassName = `typography-article-quote-${size}`;
  const combinedClassName = classNames(typographyClassName, className);

  return (
    <blockquote className={combinedClassName} data-testid={dataTestId} {...rest}>
      {children}
    </blockquote>
  );
};

ArticleQuote.displayName = 'ArticleQuote';
export type { ArticleQuoteProps };
