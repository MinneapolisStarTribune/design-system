import React from 'react';
import classNames from 'classnames';
import { useBrandValidation } from '@/hooks/useBrandValidation';
import type {
  CreateEditorialHeadingOptions,
  EditorialHeadingImportance,
  EditorialHeadingProps,
} from '../Editorial/types';

/**
 * Factory for editorial heading components (NewsHeading, SponsoredHeading, etc.).
 * Each variant uses the same props and semantics; styling is driven by design tokens
 * via the generated class name typography-editorial-{prefix}-h{1-6}.
 *
 * @example
 * export const NewsHeading = createEditorialHeading({
 *   componentName: 'NewsHeading',
 *   classNamePrefix: 'news',
 * });
 */
export function createEditorialHeading({
  componentName,
  classNamePrefix,
}: CreateEditorialHeadingOptions): React.FC<EditorialHeadingProps> {
  const getHeadingConfig = (importance: EditorialHeadingImportance) => {
    const configs: Record<
      EditorialHeadingImportance,
      { element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; className: string }
    > = {
      1: {
        element: 'h1',
        className: `typography-editorial-${classNamePrefix}-h1`,
      },
      2: {
        element: 'h2',
        className: `typography-editorial-${classNamePrefix}-h2`,
      },
      3: {
        element: 'h3',
        className: `typography-editorial-${classNamePrefix}-h3`,
      },
      4: {
        element: 'h4',
        className: `typography-editorial-${classNamePrefix}-h4`,
      },
      5: {
        element: 'h5',
        className: `typography-editorial-${classNamePrefix}-h5`,
      },
      6: {
        element: 'h6',
        className: `typography-editorial-${classNamePrefix}-h6`,
      },
    };
    return configs[importance];
  };

  const EditorialHeading: React.FC<EditorialHeadingProps> = ({
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

  EditorialHeading.displayName = componentName;
  return EditorialHeading;
}
