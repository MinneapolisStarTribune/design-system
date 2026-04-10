import React from 'react';
import classNames from 'classnames';
import type { PageHeadingProps } from '../PageHeading.types';
import { resolveTextColorStyle } from '@/types';

const getHeadingConfig = (importance: PageHeadingProps['importance']) => {
  const configs: Record<
    PageHeadingProps['importance'],
    { element: 'h1' | 'h2' | 'h3' | 'h4'; className: string }
  > = {
    1: { element: 'h1', className: 'typography-utility-page-h1' },
    2: { element: 'h2', className: 'typography-utility-page-h2' },
    3: { element: 'h3', className: 'typography-utility-page-h3' },
    4: { element: 'h4', className: 'typography-utility-page-h4' },
  };
  return configs[importance];
};

export const PageHeading: React.FC<PageHeadingProps> = ({
  importance,
  children,
  dataTestId,
  className,
  color,
  style,
}) => {
  const { element: HeadingTag, className: typographyClassName } = getHeadingConfig(importance);
  const combinedClassNames = classNames(typographyClassName, className);

  return React.createElement(
    HeadingTag,
    {
      className: combinedClassNames,
      'data-testid': dataTestId,
      style: resolveTextColorStyle(color, style),
    },
    children
  );
};

export type { PageHeadingImportance, PageHeadingProps } from '../PageHeading.types';
