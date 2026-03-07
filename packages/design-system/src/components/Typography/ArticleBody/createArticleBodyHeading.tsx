import classNames from 'classnames';
import { useBrandValidation } from '@/hooks/useBrandValidation';
import type { ComponentName } from '@/types/component-names';
import type {
  EditorialHeadingImportance,
  EditorialHeadingProps,
} from '@/components/Typography/Editorial';

interface CreateArticleBodyHeadingOptions {
  componentName: ComponentName;
  /** Class name segment (e.g. 'sponsored'). Produces typography-article-body-{prefix}-h1 … h6. */
  classNamePrefix: string;
}

/**
 * Factory for article body heading components.
 * Produces typography-article-body-{prefix}-h1 … h6 (no "editorial" in path).
 */
export function createArticleBodyHeading({
  componentName,
  classNamePrefix,
}: CreateArticleBodyHeadingOptions): React.FC<EditorialHeadingProps> {
  const getHeadingConfig = (importance: EditorialHeadingImportance) => {
    const configs: Record<
      EditorialHeadingImportance,
      { element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; className: string }
    > = {
      1: {
        element: 'h1',
        className: `typography-article-body-${classNamePrefix}-h1`,
      },
      2: {
        element: 'h2',
        className: `typography-article-body-${classNamePrefix}-h2`,
      },
      3: {
        element: 'h3',
        className: `typography-article-body-${classNamePrefix}-h3`,
      },
      4: {
        element: 'h4',
        className: `typography-article-body-${classNamePrefix}-h4`,
      },
      5: {
        element: 'h5',
        className: `typography-article-body-${classNamePrefix}-h5`,
      },
      6: {
        element: 'h6',
        className: `typography-article-body-${classNamePrefix}-h6`,
      },
    };
    return configs[importance];
  };

  const ArticleBodyHeading: React.FC<EditorialHeadingProps> = ({
    importance,
    children,
    className,
    ...props
  }) => {
    useBrandValidation(componentName);
    const { element: HeadingElement, className: typographyClass } = getHeadingConfig(importance);
    const combinedClassName = classNames(typographyClass, className);
    return (
      <HeadingElement className={combinedClassName || undefined} {...props}>
        {children}
      </HeadingElement>
    );
  };

  ArticleBodyHeading.displayName = componentName;
  return ArticleBodyHeading;
}
