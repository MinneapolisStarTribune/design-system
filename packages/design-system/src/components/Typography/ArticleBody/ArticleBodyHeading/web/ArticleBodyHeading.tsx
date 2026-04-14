import classNames from 'classnames';
import { useBrandValidation } from '@/hooks/useBrandValidation';
import { resolveTextColorStyle } from '@/types/globalTypes';
import type {
  ArticleBodyHeadingProps,
  ArticleBodyHeadingImportance,
} from '../ArticleBodyHeading.types';

const getHeadingConfig = (importance: ArticleBodyHeadingImportance) => {
  const configs: Record<
    ArticleBodyHeadingImportance,
    { element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; className: string }
  > = {
    1: { element: 'h1', className: 'typography-article-body-h1' },
    2: { element: 'h2', className: 'typography-article-body-h2' },
    3: { element: 'h3', className: 'typography-article-body-h3' },
    4: { element: 'h4', className: 'typography-article-body-h4' },
    5: { element: 'h5', className: 'typography-article-body-h5' },
    6: { element: 'h6', className: 'typography-article-body-h6' },
  };
  return configs[importance];
};

export const ArticleBodyHeading: React.FC<ArticleBodyHeadingProps> = ({
  importance,
  children,
  className,
  color,
  style,
  ...props
}) => {
  useBrandValidation('ArticleBodyHeading');

  const { element: HeadingElement, className: typographyClass } = getHeadingConfig(importance);

  const combinedClassName = classNames(typographyClass, className);

  return (
    <HeadingElement
      className={combinedClassName || undefined}
      style={resolveTextColorStyle(color, style)}
      {...props}
    >
      {children}
    </HeadingElement>
  );
};

ArticleBodyHeading.displayName = 'ArticleBodyHeading';
