import classNames from 'classnames';
import { useBrandValidation } from '@/hooks/useBrandValidation';
import type {
  ArticleBodySponsoredHeadingProps,
  ArticleBodySponsoredHeadingImportance,
} from '../ArticleBodySponsoredHeading.types';

const getHeadingConfig = (importance: ArticleBodySponsoredHeadingImportance) => {
  const configs: Record<
    ArticleBodySponsoredHeadingImportance,
    { element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; className: string }
  > = {
    1: { element: 'h1', className: 'typography-article-body-sponsored-h1' },
    2: { element: 'h2', className: 'typography-article-body-sponsored-h2' },
    3: { element: 'h3', className: 'typography-article-body-sponsored-h3' },
    4: { element: 'h4', className: 'typography-article-body-sponsored-h4' },
    5: { element: 'h5', className: 'typography-article-body-sponsored-h5' },
    6: { element: 'h6', className: 'typography-article-body-sponsored-h6' },
  };
  return configs[importance];
};

export const ArticleBodySponsoredHeading: React.FC<ArticleBodySponsoredHeadingProps> = ({
  importance,
  children,
  className,
  ...props
}) => {
  useBrandValidation('ArticleBodySponsoredHeading');
  const { element: HeadingElement, className: typographyClass } = getHeadingConfig(importance);
  const combinedClassName = classNames(typographyClass, className);
  return (
    <HeadingElement className={combinedClassName || undefined} {...props}>
      {children}
    </HeadingElement>
  );
};

ArticleBodySponsoredHeading.displayName = 'ArticleBodySponsoredHeading';
export type { ArticleBodySponsoredHeadingProps, ArticleBodySponsoredHeadingImportance };
