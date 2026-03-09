import classNames from 'classnames';
import type { ArticleBodyTextProps } from '../ArticleBodyText.types';

export const ArticleBodyText: React.FC<ArticleBodyTextProps> = (props) => {
  const {
    weight = 'regular',
    children,
    dataTestId = 'article-body-text',
    className,
    ...rest
  } = props;

  const typographyClassName = `typography-article-body-${weight}`;
  const combinedClassNames = classNames(typographyClassName, className);

  return (
    <p className={combinedClassNames} data-testid={dataTestId} {...rest}>
      {children}
    </p>
  );
};

export type { ArticleBodyTextProps, ArticleBodyTextWeight } from '../ArticleBodyText.types';
