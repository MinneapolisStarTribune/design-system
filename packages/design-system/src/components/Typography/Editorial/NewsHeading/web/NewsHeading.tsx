import classNames from 'classnames';
import { useBrandValidation } from '@/hooks/useBrandValidation';
import type { NewsHeadingProps } from '../NewsHeading.types';

const getHeadingConfig = (importance: NewsHeadingProps['importance']) => {
  const configs: Record<
    NewsHeadingProps['importance'],
    { element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; className: string }
  > = {
    1: { element: 'h1', className: 'typography-editorial-news-h1' },
    2: { element: 'h2', className: 'typography-editorial-news-h2' },
    3: { element: 'h3', className: 'typography-editorial-news-h3' },
    4: { element: 'h4', className: 'typography-editorial-news-h4' },
    5: { element: 'h5', className: 'typography-editorial-news-h5' },
    6: { element: 'h6', className: 'typography-editorial-news-h6' },
  };

  return configs[importance];
};

export const NewsHeading: React.FC<NewsHeadingProps> = ({
  importance,
  children,
  className,
  ...props
}) => {
  useBrandValidation('NewsHeading');
  const { element: HeadingElement, className: typographyClass } = getHeadingConfig(importance);
  const combinedClassName = classNames(typographyClass, className);

  return (
    <HeadingElement className={combinedClassName || undefined} {...props}>
      {children}
    </HeadingElement>
  );
};

NewsHeading.displayName = 'NewsHeading';

export type { NewsHeadingImportance, NewsHeadingProps } from '../NewsHeading.types';
